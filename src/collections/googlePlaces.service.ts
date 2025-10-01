import { getDistance } from 'geolib';
import { convert } from 'url-slug';
import { v4 as uuidv4 } from 'uuid';
import type { TimeOfDayEnum } from '../models/enums/tod.enum.js';
import type { PoiInput } from '../models/poi.model.js';
import type { GooglePlacesFeature } from './googleplaces/googleplacesJson.type.js';

type LatLng = {
	lat: number;
	lng: number;
};

export type GooglePlacesSearchProps = {
	textQuery: string;
	lat: number;
	lng: number;
	radius: number;
};

type GooglePlacesPlace = {
	/** Like places/ChIJN0yDs42ipBIR5T7Lyi9E29k */
	name: string;
	id: string;
	types: string[];
	formattedAddress: string;
	location: {
		latitude: number;
		longitude: number;
	};
	businessStatus: 'OPERATIONAL' | 'UNKNOWN' | ({} & string);
	displayName: {
		/** Like Champanillo | Barcelona */
		text: string;
		languageCode: 'en' | ({} & string);
	};
	/** Like bar_and_grill */
	primaryType: string;
	postalAddress: {
		regionCode: 'ES';
		languageCode: 'en';
		/** Like '08007'. This is very occasionally undefined for some reason */
		postalCode?: string;
		/** Like: 'Barcelona' */
		administrativeArea: string;
		/** Like 'Barcelona' */
		locality: string;
		/** Like ['Pl. del Dr. Letamendi, 37', ...] */
		addressLines: string[];
	};
};

export type MergedPlaceLookupData = {
	data: PoiInput;
	errors: string[];
	warnings: string[];
};

const CENTER_OF_BARCELONA: LatLng = {
	lat: 41.3851,
	lng: 2.1734,
};

export const BARCELONA_RADIUS = 8000; // in metres

export async function searchPlacesApi(
	searchCriteria: GooglePlacesSearchProps,
	apiKey: string
): Promise<{
	places: GooglePlacesPlace[];
} | null> {
	const { textQuery, lat, lng, radius } = searchCriteria;
	const url = `https://places.googleapis.com/v1/places:searchText`;

	// do post request
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': apiKey,
			'X-Goog-FieldMask':
				'places.id,places.name,places.displayName,places.formattedAddress,places.postalAddress,places.location,places.types,places.businessStatus,places.primaryType',
			// These fields would use enterprise price: places.websiteUri,places.editorialSummary
		},
		body: JSON.stringify({
			textQuery,
			locationBias: {
				circle: {
					center: {
						latitude: lat,
						longitude: lng,
					},
					radius: radius,
				},
			},
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			// console.log({ google: data });
			return data;
		})
		.catch((error) => {
			console.error('Error:', error);
			return null;
		});
}

export function mergePlaceData(
	poi: PoiInput,
	googlePlaces: GooglePlacesPlace[]
): MergedPlaceLookupData {
	const warnings: string[] = [];
	const errors: string[] = [];
	const latLngMismatchAccuracy = 0.0000001;

	if (googlePlaces.length === 0) {
		errors.push(`No places found for ${poi.nameOfficial}`);
	}

	if (googlePlaces.length > 1) {
		warnings.push(`Multiple places found (${googlePlaces.length}) for ${poi.nameOfficial}`);
	}

	const firstPlace = googlePlaces[0];

	if (poi.nameOfficial !== firstPlace.displayName.text) {
		errors.push(`Name mismatch: ${poi.nameOfficial} !== ${firstPlace.displayName.text}`);
	}
	if (poi.lat !== firstPlace.location.latitude) {
		warnings.push(`Latitude exact mismatch: ${poi.lat} !== ${firstPlace.location.latitude}`);
		// check if lat value differs by more than 7 decimal places
		if (poi.lat - firstPlace.location.latitude > latLngMismatchAccuracy) {
			errors.push(`Latitude mismatch: ${poi.lat} !== ${firstPlace.location.latitude}`);
		}
	}
	if (poi.lng !== firstPlace.location.longitude) {
		warnings.push(`Longitude exact mismatch: ${poi.lng} !== ${firstPlace.location.longitude}`);
		// check if lng value differs by more than 7 decimal places
		if (poi.lng - firstPlace.location.longitude > latLngMismatchAccuracy) {
			errors.push(`Latitude mismatch: ${poi.lng} !== ${firstPlace.location.longitude}`);
		}
	}

	const filteredTypes = firstPlace.types
		.filter((t) => t) // sometimes nulls!
		.filter((t) => t !== firstPlace.primaryType);
	filteredTypes.unshift(firstPlace.primaryType);

	const mergedPoi: PoiInput = {
		...poi,
		address: firstPlace.formattedAddress,
		postcode: firstPlace.postalAddress?.postalCode ?? '',
		lat: firstPlace.location.latitude,
		lng: firstPlace.location.longitude,
		tags: filteredTypes,
		status: firstPlace.businessStatus || 'UNKNOWN',
	};

	return {
		data: mergedPoi,
		errors,
		warnings,
	};
}

export function latLngToFilename(lat: number, lng: number): string {
	const filename = [
		`${lat.toString().replace('.', '_')}`,
		`${lng.toString().replace('.', '_')}`,
	].join('-');
	return `${filename}.json`;
}

export function validatePlaceData(place: GooglePlacesFeature): {
	place: GooglePlacesFeature | false;
	errors: string[];
} {
	const errors: string[] = [];

	if (!place.properties.location || !place.properties.location.name) {
		errors.push(`No place location name`);
		return { place: false, errors };
	}

	if (!place.geometry.coordinates) {
		errors.push(`No coordinates for: ${place.properties.location.name}`);
		return { place: false, errors };
	}
	const googleLat = place.geometry.coordinates[1];
	const googleLng = place.geometry.coordinates[0];

	if (googleLat === 0 && googleLng === 0) {
		errors.push(`Invalid coordinates for: ${place.properties.location.name}`);
		return { place: false, errors };
	}

	// filter out non-spanish places
	if (!place.properties.location) {
		errors.push(`No location data for: ${place.properties.google_maps_url}`);
		return { place: false, errors };
	}

	// ignore definitely wrong places outside of ES
	if (
		place.properties.location.country_code &&
		place.properties.location.country_code.toUpperCase() !== 'ES'
	) {
		errors.push('Place is outside Spain');
		return { place: false, errors };
	}

	// const lat = Number.parseFloat(place.geometry.coordinates[0]);
	const lat = googleLat;
	const lng = googleLng;

	const to: LatLng = {
		lat,
		lng,
	};
	const distance = getDistance(CENTER_OF_BARCELONA, to);

	// @todo - do as a radius...
	// const isNearBarcelona = lat > 41.2 && lat < 41.5 && lng > 2.05 && lng < 2.4;
	const isNearBarcelona = distance < BARCELONA_RADIUS;
	if (!isNearBarcelona) {
		errors.push(
			`${place.properties.location.name} is too far away: ${lat}, ${lng} - ${distance} metres`
		);
		return { place: false, errors };
	}
	return { place, errors };
}

export function mapFeatureToPoi(
	record: GooglePlacesFeature,
	mapIndex: number
): PoiInput | undefined {
	const placeName: string = record.properties.location.name ?? '';
	if (!placeName) {
		console.warn(
			`No business name found at index ${mapIndex} for ${record.properties.location.address ?? 'Unknown address!'}`
		);
		return undefined;
	}

	let nameWithoutDiacritics = '';
	try {
		// Remove accents/diacritics from the business name (é -> e)
		nameWithoutDiacritics = placeName
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.trim();
		// biome-ignore lint/suspicious/noExplicitAny: OK
	} catch (error: any) {
		console.log(error.message ? error.message : error);
		throw new Error(error);
	}
	if (!nameWithoutDiacritics) return undefined;

	const slug = convert(nameWithoutDiacritics);

	const lat = record.geometry.coordinates[1]; // note - google has lng/lat for some reason
	const lng = record.geometry.coordinates[0];

	return {
		poiId: uuidv4(),
		active: true,
		provinceId: 2, // logic here
		barrioId: 86, // logic here
		// categoryId: CategoryIdEnum.BarsRestaurants,
		categoryId: 2,
		nameOfficial: placeName,
		nameOfficialAccentless: nameWithoutDiacritics,
		slug,
		address: record.properties.location.address || '',
		postcode: '',
		description: '',
		bestTod: 0 as TimeOfDayEnum, // @todo - fix this
		price: 0,
		boost: 0,
		// requiresBooking: RequiresBookingEnum.No,
		requiresBooking: 1,
		lat,
		lng,
		latlngAccurate: record.geometry.type === 'Point',
		countryCode: record.properties.location.country_code ?? 'ES',
		website: '',
		tags: [''],
		status: '',
		comments: [],
	};
}
