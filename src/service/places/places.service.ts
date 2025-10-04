import type { ImageAssetsSize } from '../../models/imageAssets.model.js';
import type { PlaceDocument, PlaceInput } from '../../models/place.model.js';
import type { PlaceLookupDocument } from '../../models/placeLookup.js';
import type { PlaceSearchDocument } from '../../models/placeSearch.js';
import {
	getByIdHandler,
	getListHandler,
	getPlaceCategoriesHandler,
	getPlaceLookupHandler,
	getRelatedPlacesHandler,
	getSearchPrepopulateHandler,
} from './functions/index.js';

// import 'dotenv/config'; // support for dotenv injecting into the process env

const getMappedPlaceDocuments = (places: PlaceDocument[]): PlaceInput[] => {
	return places.map((p) => {
		return getMappedPlace(p);
	});
};

const getMappedPlace = (place: PlaceDocument): PlaceInput => {
	// get province
	const province = getProvinceById(place.provinceId);

	// build images
	const sizes: ImageAssetsSize[] = ['thumb', 'small', 'medium', 'large', 'xlarge'];
	const images: PlaceDocument['images'] = sizes.map((s) => {
		const poster = getPoster(place, s);
		return {
			size: s,
			url: poster,
		};
	});

	const rating: PlaceDocument['rating'] = getPlaceRating(place);

	return {
		...place,
		images,
		rating,
		province,
	};
};

/** Build a trimmed down version of the places document */
const getMappedSearchPlace = (places: PlaceDocument[]): PlaceSearchDocument[] => {
	return places.map((place) => {
		return {
			placeId: place.placeId,
			labelEng: place.labelEng,
			labelCat: place.labelCat,
			labelEsp: place.labelEsp,
			description: place.description || '',
			slug: place.slug,
			tags: place.tags,
			barrioId: place.barrioId,
		};
	});
};

/** Build a trimmed down version of the places document */
const getMappedLookupPlace = (places: PlaceDocument[]): PlaceLookupDocument[] => {
	return places.map((place) => {
		return {
			placeId: place.placeId,
			labelCat: place.labelCat,
		};
	});
};

/**
 * Get the poster image for a place, given a certain size. If place is set to not have an image, return the placeholder image
 * @param place The place
 * @param size The size of the image required
 * @returns
 */
const getPoster = (place: PlaceDocument, size: ImageAssetsSize): string => {
	// const base = process.env.AWS_S3_BUCKET; @todo - where the fuck is this variable on the instance?!!!
	const base = 'https://cdn.pocketbarcelona.com';
	const noImagePoster = `${base}/app/places/images/avif/placeholder_${size}.avif`;
	if (!place.hasImage) return noImagePoster;

	const path = `${base}/app/places/images/avif/${size}/${place.placeId}_poster.avif`;
	return path;
};

/**
 * Build an easy to use rating stars object so the FE does not have to compute it
 */
const getPlaceRating = (place: PlaceDocument): PlaceDocument['rating'] => {
	const placeRating: PlaceDocument['rating'] = {
		rating: '0',
		ratingIndex: 0,
		ratingStars: [],
	};

	let rating = 3;

	if (place.popular) {
		rating += 1;
	}

	if (place.boost) {
		// @todo - round to 1 dp
		rating += Math.round(place.boost / 100);
	}

	placeRating.rating = rating.toFixed(1);

	placeRating.ratingIndex = (place.popular ? 1 : 0) + place.boost;

	const stars: string[] = [];
	for (let index = 0; index < 5; index++) {
		if (rating <= index) {
			stars.push('none');
		} else if (rating >= index + 1) {
			stars.push('full');
		} else {
			stars.push('half');
		}
	}

	placeRating.ratingStars = [...stars];
	return placeRating;
};

/** Lookup a province name given its ID. If the place is not in Spain, return a fixed string */
const getProvinceById = (provinceId: PlaceDocument['provinceId']): string => {
	const exists = provincesLookup.find((p) => p.id === provinceId);
	return exists ? exists.province : 'Outside Spain';
};

/** List of provinces in Spain. The ID is ours and place data contains it */
const provincesLookup = [
	{ id: 1, province: 'Andalusia' },
	{ id: 2, province: 'Catalonia' },
	{ id: 3, province: 'Madrid' },
	{ id: 4, province: 'Valencia' },
	{ id: 5, province: 'Galicia' },
	{ id: 6, province: 'Castile and León' },
	{ id: 7, province: 'Basque Country' },
	{ id: 8, province: 'Canary Islands' },
	{ id: 9, province: 'Castile-La Mancha' },
	{ id: 10, province: 'Murcia' },
	{ id: 11, province: 'Aragón' },
	{ id: 12, province: 'Extremadura' },
	{ id: 13, province: 'Balearic Islands' },
	{ id: 14, province: 'Asturias' },
	{ id: 15, province: 'Navarre' },
	{ id: 16, province: 'Cantabria' },
	{ id: 17, province: 'La Rioja' },
	{ id: 18, province: 'Ceuta' },
	{ id: 19, province: 'Melilla' },
	{ id: 20, province: 'Alicante' },
	{ id: 21, province: 'Andorra' },
];

export default {
	getList: getListHandler,
	getById: getByIdHandler,
	getRelatedPlaces: getRelatedPlacesHandler,
	getPlaceCategories: getPlaceCategoriesHandler,
	getSearchPrepopulate: getSearchPrepopulateHandler,
	getPlaceLookupList: getPlaceLookupHandler,
	getMappedPlaceDocuments,
	getMappedPlace,
	getMappedSearchPlace,
	getMappedLookupPlace,
};
