import * as geolib from 'geolib';
import { describe, expect, it, vi } from 'vitest';
import {
	getMultipleRandomItemsFromArray,
	getRandomItemFromArray,
	ONE_DAY_IN_MS,
	orderByDistanceClosest,
} from './utils.js';

vi.mock('geolib');

describe('getRandomItemFromArray', () => {
	it('should return an item from the array', () => {
		const array = ['a', 'b', 'c'];
		const result = getRandomItemFromArray(array);
		expect(array).toContain(result);
	});

	it('should return the only item from single-item array', () => {
		const array = ['single'];
		const result = getRandomItemFromArray(array);
		expect(result).toBe('single');
	});
});

describe('getMultipleRandomItemsFromArray', () => {
	it('should return requested number of items', () => {
		const array = [1, 2, 3, 4, 5];
		const result = getMultipleRandomItemsFromArray(array, 3);
		expect(result).toHaveLength(3);
	});

	it('should return all items when requesting more than available', () => {
		const array = [1, 2];
		const result = getMultipleRandomItemsFromArray(array, 5);
		expect(result).toHaveLength(2);
	});

	it('should return empty array when requesting 0 items', () => {
		const array = [1, 2, 3];
		const result = getMultipleRandomItemsFromArray(array, 0);
		expect(result).toHaveLength(0);
	});
});

describe('orderByDistanceClosest', () => {
	const mockRecords = [
		{ id: 1, lat: 41.4, lng: 2.2 },
		{ id: 2, lat: 41.3, lng: 2.1 },
		{ id: 3, lat: 41.5, lng: 2.3 },
	];

	it('should sort records by distance from closest to farthest', () => {
		vi.mocked(geolib.getDistance)
			.mockReturnValueOnce(1000) // distance from home to record 1
			.mockReturnValueOnce(500) // distance from home to record 2 - should

			.mockReturnValueOnce(900) // distance from home to record 2
			.mockReturnValueOnce(900) // distance from home to record 3

			.mockReturnValueOnce(800) // distance to home record 3
			.mockReturnValueOnce(800); // distance to home record 4

		const from = { lat: 41.35, lng: 2.15 };
		const result = orderByDistanceClosest(from, mockRecords);

		expect(result[0].id).toBe(2); // closest
		expect(result[1].id).toBe(1);
		expect(result[2].id).toBe(3); // farthest
	});

	it('should handle empty array', () => {
		const result = orderByDistanceClosest({ lat: 41.35, lng: 2.15 }, []);
		expect(result).toEqual([]);
	});
});

describe('ONE_DAY_IN_MS', () => {
	it('should equal 86400000 milliseconds', () => {
		expect(ONE_DAY_IN_MS).toBe(86400000);
	});
});
