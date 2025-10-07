import { getDistance } from 'geolib';

/** Choose a random item from an array */
export const getRandomItemFromArray = <T>(theArray: T[]): T => {
	const randomArrayIndex = getRandomNumberFromTo(0, theArray.length - 1);
	return theArray[randomArrayIndex];
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 * @url https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
 */
const getRandomNumberFromTo = (_min: number, _max: number): number => {
	const min = Math.ceil(_min);
	const max = Math.floor(_max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get n random items from an array
 * @link https://bobbyhadz.com/blog/javascript-get-multiple-random-elements-from-array#:~:text=To%20get%20multiple%20random%20elements,to%20get%20multiple%20random%20elements.
 * @param  {T[]} arr
 * @param  {number} num
 * @returns T
 */
export const getMultipleRandomItemsFromArray = <T>(arr: T[], num: number): T[] => {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, num);
};

export const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000;

export type LatLng = {
	lat: number;
	lng: number;
};

export const orderByDistanceClosest = <T>(from: LatLng, records: Array<T & LatLng>) => {
	const newRecords = records.sort((aPlace, bPlace) => {
		const distanceFromA = getDistance(from, {
			lat: aPlace.lat,
			lng: aPlace.lng,
		});
		const distanceFromB = getDistance(from, {
			lat: bPlace.lat,
			lng: bPlace.lng,
		});

		if (distanceFromB < distanceFromA) {
			return -1;
		}
		if (distanceFromB > distanceFromA) {
			return 1;
		}
		return 0;
	});

	return newRecords;
};

export const getLatLngFromString = (latLngString: string): LatLng => {
	const [lat, lng] = latLngString.split(',');
	return {
		lat: parseFloat(lat),
		lng: parseFloat(lng),
	};
};

// // https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
// randomlySortArray<T[]>(theArray: T[]): T[] {
//   const shuffleArray = array => {
//     for (let i = array.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       const temp = array[i];
//       array[i] = array[j];
//       array[j] = temp;
//     }
//   }
// }
