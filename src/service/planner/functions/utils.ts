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
