/** biome-ignore-all lint/correctness/noUnusedVariables: WIP */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
	GooglePlacesFeature,
	GooglePlacesJsonType as GooglePlacesTakeoutType,
} from './googleplacesJson.type.js';
import 'dotenv/config'; // support for dotenv injecting into the process env
// import { v4 as uuidv4 } from 'uuid';
import type { PoiInput } from '../../models/poi.model.js';
import PoiTagModel, { type PoiTagInput } from '../../models/poiTag.model.js';
// import { findBarrioByLatLng } from '../../service/barrios/barrios.service.js';
// import { BarriosData } from '../barrios/data.js';
import {
	BARCELONA_RADIUS,
	type GooglePlacesSearchProps,
	latLngToFilename,
	type MergedPlaceLookupData,
	mapFeatureToPoi,
	mergePlaceData,
	searchPlacesApi,
	validatePlaceData,
} from '../googlePlaces.service.js';

const NUMBER_OF_PLACES_TO_PROCESS = 810;

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
if (!GOOGLE_PLACES_API_KEY) {
	throw new Error('No Google Places API key found!');
}

let NUMBER_OF_GOOGLE_API_CALLS = 0;
const CACHE_FOLDER = path.join(process.cwd(), 'src', 'collections', 'googleplaces', 'cache');
// create folder if not exists
if (!fs.existsSync(CACHE_FOLDER)) {
	fs.mkdirSync(CACHE_FOLDER);
}

// get path, since __dirname is not available!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// json file to import
const jsonFilename = '2025_09_05_savedPlaces.json';
// get json file ref
const jsonFile = path.join(__dirname, jsonFilename);
// resolve path
const jsonFilePath = path.resolve(jsonFile);
// read file
const fileContent = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });

let rawData: GooglePlacesTakeoutType | undefined;
try {
	rawData = JSON.parse(fileContent) as GooglePlacesTakeoutType;
	// biome-ignore lint/suspicious/noExplicitAny: OK
} catch (error: any) {
	throw new Error(error);
}
if (!rawData) {
	throw new Error('No data to add to the DB!');
}

const { features = [] } = rawData;

const hasRecords = features.length > 0;
if (!hasRecords) {
	throw new Error('No data to process');
}

const placesMap = new Map<string, MergedPlaceLookupData>();
const placesWithErrorsMap = new Map<string, MergedPlaceLookupData>();

const validatedFeatures = features.map((feature) => validatePlaceData(feature));

const validRecords = validatedFeatures.filter((validated) => validated.place !== false);
const invalidRecords = validatedFeatures.filter((validated) => validated.place === false);

console.log('Total features in Google Takeout', features.length);
console.log('Total invalid records found', invalidRecords.length);
console.log('Total valid records to process', validRecords.length);

// console.log('Invalid records are (first 100):');
// invalidRecords.forEach((record) => {
// 	console.log(record.errors.join('\n'));
// });

const mappedRecords = validRecords.map<PoiInput | undefined>((p, i) =>
	mapFeatureToPoi(p.place as GooglePlacesFeature, i)
);

if (mappedRecords.length > NUMBER_OF_PLACES_TO_PROCESS) {
	console.warn(
		`Warning: Only processing ${NUMBER_OF_PLACES_TO_PROCESS} of ${mappedRecords.length} records`
	);
}

// temp lookup
// const getLocalBarrioByBarrioName = (barrioName: string): number | null => {
// 	const found = BarriosData.find((b) => b.officialName === barrioName);
// 	return found ? found.barrioId : null;
// };

// lookup place info in Google Places API, checking cache first
for (const record of mappedRecords.slice(0, NUMBER_OF_PLACES_TO_PROCESS)) {
	if (!record) continue;

	// check if existing cached response
	const filename = latLngToFilename(record.lat, record.lng);
	const cachedFile = path.join(CACHE_FOLDER, filename);
	const fileExists = fs.existsSync(cachedFile);
	if (fileExists) {
		console.info(`Using cached file for ${record.poiId}: ${filename} ${record.nameOfficial}`);
		const cachedFileContent = fs.readFileSync(cachedFile, { encoding: 'utf-8' });
		const cachedPlace = JSON.parse(cachedFileContent) as MergedPlaceLookupData;

		// UPDATE BARRIO ID...
		// const foundBarrio = findBarrioByLatLng(cachedPlace.data.lat, cachedPlace.data.lng);
		// const foundBarrioId = getLocalBarrioByBarrioName(foundBarrio?.nom ?? '');
		// if (!foundBarrioId) {
		// 	console.log(
		// 		`${cachedPlace.data.nameOfficial} is in ${foundBarrio ? foundBarrio.nom : 'Unknown'}. Barrio ID=${foundBarrioId ?? '-1'}`
		// 	);
		// }
		// if (foundBarrioId) {
		// 	cachedPlace.data.barrioId = foundBarrioId;
		// 	fs.writeFileSync(cachedFile, JSON.stringify(cachedPlace, null, 2));
		// }

		// cachedPlace.data.comments = [];
		// fs.writeFileSync(cachedFile, JSON.stringify(cachedPlace, null, 2));

		placesMap.set(record.poiId, cachedPlace);
		continue;
	}

	// if no cache, lookup place

	const fetchArgs: GooglePlacesSearchProps = {
		textQuery: record.nameOfficial,
		lat: record.lat,
		lng: record.lng,
		radius: BARCELONA_RADIUS,
	};

	NUMBER_OF_GOOGLE_API_CALLS = NUMBER_OF_GOOGLE_API_CALLS + 1;

	// sleep for 1 second to avoid rate limiting
	await new Promise((resolve) => setTimeout(resolve, 1000));

	console.info(`Looking up ${record.poiId}: ${record.nameOfficial}`);
	const fetchedPlace = await searchPlacesApi(fetchArgs, GOOGLE_PLACES_API_KEY);

	if (!fetchedPlace || !fetchedPlace.places || fetchedPlace.places.length < 1) {
		console.log('No place found for: ', record.nameOfficial);
		// TODO - add to json file
		continue;
	}

	const mergedData = mergePlaceData(record, fetchedPlace.places);
	if (mergedData.data && mergedData.errors.length === 0) {
		placesMap.set(record.poiId, mergedData);
	} else {
		placesWithErrorsMap.set(record.poiId, mergedData);
	}

	// write to file
	fs.writeFileSync(cachedFile, JSON.stringify(mergedData, null, 2));
}

if (placesWithErrorsMap.size > 0) {
	console.warn('#################################');
	console.warn('Places with errors: ', placesWithErrorsMap.size);
	console.warn('#################################');
	placesWithErrorsMap.forEach((value, key) => {
		console.warn(
			`Place with errors: ${value.data.nameOfficial}, ${key}, ${value.errors.join(', ')}`
		);
	});
}

const onlyRestaurants = [...placesMap.values()].filter(({ data }) => {
	if (data.tags.includes('restaurant')) {
		return data;
	}
});

const onlyRestaurantsUniqueMap = new Map<
	string,
	{
		place: PoiInput;
		count: number;
	}
>();

const capitalizeWords = (str: string) => {
	return str.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const tagToLabel = (tag: string) => {
	return capitalizeWords(tag.replaceAll('_', ' '));
};

const excludeTags: string[] = [
	'restaurant',
	'establishment',
	'event_venue',
	'point_of_interest',
	'food',
	'liquor_store',
	'meal_takeaway',
	'store',
	'farm',
	'food_store',
	'meal_delivery',
	'food_delivery',
	'confectionery',
	'catering_service',
	'sports_complex',
	'sports_activity_location',
	'butcher_shop',
	'karaoke',
	'skateboard_park',
	'wholesaler',
	'concert_hall',
	'auditorium',
	'tourist_information_center',
	'tour_agency',
	'travel_agency',
	'shopping_mall',
	'movie_theater',
	'amusement_center',
	'jewelry_store',
	'supermarket',
	'grocery_store',
	'clothing_store',
	'chocolate_shop',
	'candy_store',
	'dessert_shop',
	'hotel',
	'lodging',
	'cafeteria',
	'bakery',
	'night_club',
	'tea_house',
	'ice_cream_shop',
	'donut_shop',
	'sandwich_shop',
	'dog_cafe',
];
const allTags = new Map<string, PoiTagInput>();
onlyRestaurants.forEach(({ data }) => {
	data.tags.forEach((tag) => {
		if (typeof tag !== 'string') {
			console.log('Found non-string tag: ', tag);
			console.log(data, tag);
		} else {
			const exists = allTags.get(tag);
			const shouldIgnoreTag = excludeTags.includes(tag);

			if (exists) {
				allTags.set(tag, {
					...exists,
					count: exists.count + 1,
				});
			} else {
				allTags.set(tag, {
					tagId: tag,
					count: 1,
					active: !shouldIgnoreTag,
					label: tagToLabel(tag),
				});
			}
		}
	});

	const exists = onlyRestaurantsUniqueMap.get(data.poiId);
	if (!exists) {
		onlyRestaurantsUniqueMap.set(data.poiId, {
			place: data,
			count: 1,
		});
	} else {
		onlyRestaurantsUniqueMap.set(data.poiId, {
			place: exists.place,
			count: exists.count + 1,
		});
	}
});

console.log('Total restaurants found: ', onlyRestaurants.length);

Array.from(onlyRestaurantsUniqueMap.values()).forEach(({ place, count }) => {
	if (count > 1) {
		console.warn(`Warning: duplicate: ${place.nameOfficial}. Count ${count}`);
	}
});

console.log('All tags found: ', allTags.size);

// let tagCode = '{ "tags": [\n';
// [...allTags.values()]
// .forEach((t, _idx) => {
// 	const shouldIgnoreTag = excludeTags.includes(t.tag);
// 	if (shouldIgnoreTag) {
// 		console.log('Setting tag inactive for', t.tag);
// 	}
// 	tagCode += `{ "tag": "${t.tag}", "label": "${tagToLabel(t.tag)}", "count": ${t.count}, "active": ${!shouldIgnoreTag} },\n`;
// });
// tagCode += ']}';
// console.log(tagCode);

console.warn('#################################');
console.warn('Total Google Places API calls: ', NUMBER_OF_GOOGLE_API_CALLS);
console.warn('#################################');

const uniqueRestaurants = [...onlyRestaurantsUniqueMap.values()];

// try {
// 	const unprocessed: PoiInput[] = [];
// 	// batch put only supports X at a time!

// 	const chunkSize = 10;
// 	for (let i = 0; i < uniqueRestaurants.length; i += chunkSize) {
// 		// if (i >= chunkSize) continue; // stop after first batch

// 		const chunk = uniqueRestaurants.slice(i, i + chunkSize).map((p) => p.place);
// 		PoiModel.batchPut(chunk, (err) => {
// 			if (err) {
// 				console.log('Batch Put Error: ', err);
// 				unprocessed.push(err);
// 			}
// 		});
// 	}

// 	if (unprocessed.length > 0) {
// 		console.error(`Unprocessed: ${unprocessed.length} records`);
// 	}
// } catch (err) {
// 	if (err instanceof Error) {
// 		console.error(err.message);
// 	}
// 	console.error('Server error!');
// }

// IMPORT TAGS
const tagsArray = [...allTags.values()].filter((t) => t.active);
try {
	const unprocessed: PoiTagInput[] = [];
	// batch put only supports X at a time!

	const chunkSize = 10;
	for (let i = 0; i < tagsArray.length; i += chunkSize) {
		// if (i >= chunkSize) continue; // stop after first batch

		const chunk = tagsArray.slice(i, i + chunkSize);
		// console.log('Would put: ', chunk);
		PoiTagModel.batchPut(chunk, (err) => {
			if (err) {
				console.log('Batch Put Error: ', err);
				unprocessed.push(err);
			}
		});
	}

	if (unprocessed.length > 0) {
		console.error(`Unprocessed: ${unprocessed.length} tags`);
	}
} catch (err) {
	if (err instanceof Error) {
		console.error(err.message);
	}
	console.error('Server error!');
}
