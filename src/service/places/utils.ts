import type { PlaceDocument } from '../../models/place.model.js';

type FilterFields = keyof Pick<
	PlaceDocument,
	| 'active'
	| 'placeId'
	| 'provinceId'
	| 'barrioId'
	| 'categoryId'
	| 'price'
	| 'timeRecommended'
	| 'bestTod'
	| 'commitmentRequired'
	| 'price'
	| 'childrenSuitability'
	| 'teenagerSuitability'
	| 'popular'
	| 'annualOnly'
	| 'seasonal'
	| 'availableDaily'
	| 'availableSundays'
	| 'isLandmark'
	| 'requiresBooking'
	| 'metroZone'
	| 'hasImage'
	| 'placeTown'
	| 'daytrip'
	| 'tags'
>;
type FilterFieldsType = keyof Pick<PlaceDocument, FilterFields>;

export const PLACE_FILTER_FIELDS: Record<FilterFieldsType, FilterFieldsType> = {
	active: 'active',
	annualOnly: 'annualOnly',
	availableDaily: 'availableDaily',
	availableSundays: 'availableSundays',
	barrioId: 'barrioId',
	bestTod: 'bestTod',
	categoryId: 'categoryId',
	childrenSuitability: 'childrenSuitability',
	commitmentRequired: 'commitmentRequired',
	daytrip: 'daytrip',
	hasImage: 'hasImage',
	metroZone: 'metroZone',
	isLandmark: 'isLandmark',
	placeId: 'placeId',
	placeTown: 'placeTown',
	popular: 'popular',
	price: 'price',
	provinceId: 'provinceId',
	requiresBooking: 'requiresBooking',
	seasonal: 'seasonal',
	teenagerSuitability: 'teenagerSuitability',
	timeRecommended: 'timeRecommended',
	tags: 'tags',
};

/**
 * Return a list of binary bits which are included ("on") in the input decimal number
 * @param weight
 * @param binaryValues
 * @returns
 */
export const getBitwiseValue = (weight: number | undefined, binaryValues: number[]): number[] => {
	const val = (weight ?? '').toString().length > 0 ? (weight as number) : null;
	if (val) {
		return binaryValues.filter((e) => {
			return (val & e) > 0;
		});
	}
	return [];
};

const getHaversineDistance = (lat1: number, lat2: number, lng1: number, lng2: number): number => {
	// haversineSql = getHaversineDistance('pl.place_lat', ':lat_2', 'pl.place_lng', ':lng_2');
	// return "(
	//   6371 * acos(
	//       sin(radians(".lat1.")) * sin(radians(".lat2.")) + cos(radians(".lat1.")) * cos(radians(".lat2.")) * cos(radians(".lng2.") - radians(".lng1."))
	//   )
	// )";

	const degreesToRadians = (degrees: number): number => {
		return degrees * (Math.PI / 180);
	};
	const radiansToDegrees = (radians: number): number => {
		return radians * (180 / Math.PI);
	};

	const diameterOfEarth = 6371;
	const radians = {
		lat1: degreesToRadians(lat1),
		lat2: degreesToRadians(lat2),
		lng1: degreesToRadians(lng1),
		lng2: degreesToRadians(lng2),
	};

	const calc = Math.acos(
		Math.sin(radians.lat1) * Math.sin(radians.lat2) +
			Math.cos(radians.lat1) * Math.cos(radians.lat2) * Math.cos(radians.lng2 - radians.lng1)
	);
	return diameterOfEarth * calc;
};

// These sorting algorithms are super approximate!

/** Sort by sea -> mountain */
export const sortByLatAsc = (a: PlaceDocument, b: PlaceDocument) => {
	return a.lat < b.lat ? 1 : -1;
};
/** Sort by mountain -> sea */
export const sortByLatDesc = (a: PlaceDocument, b: PlaceDocument) => {
	return a.lat > b.lat ? 1 : -1;
};
/** Sort by tarragona -> girona */
export const sortByLngAsc = (a: PlaceDocument, b: PlaceDocument) => {
	return a.lng > b.lng ? 1 : -1;
};
/** Sort by girona -> tarragona */
export const sortByLngDesc = (a: PlaceDocument, b: PlaceDocument) => {
	return a.lng < b.lng ? 1 : -1;
};

/**
 * Calculate the standard deviation of an array of numbers
 * @url https://www.geeksforgeeks.org/how-to-get-the-standard-deviation-of-an-array-of-numbers-using-javascript/
 * @param arr The array of numbers
 * @returns The standard deviation of the numbers
 */
export function standardDeviation(arr: number[]): {
	stdDev: number;
	variance: number;
} {
	if (arr.length === 0)
		return {
			stdDev: 0,
			variance: 0,
		};

	// Creating the mean with Array.reduce
	const mean =
		arr.reduce((acc, curr) => {
			return acc + curr;
		}, 0) / arr.length;

	// Assigning (value - mean) ^ 2 to every array item
	const arr2 = arr.map((k) => {
		return (k - mean) ** 2;
	});

	// Calculating the sum of updated array
	const sum = arr2.reduce((acc, curr) => acc + curr, 0);

	// Calculating the variance
	const variance = sum / arr2.length;
	const stdDev = Math.sqrt(sum / arr2.length);
	// Returning the standard deviation
	return {
		stdDev,
		variance,
	};
}
