import { describe, expect, it } from 'vitest';
import type { PlaceDocument } from '../../models/place.model.js';
import {
	getBitwiseValue,
	sortByLatAsc,
	sortByLatDesc,
	sortByLngAsc,
	sortByLngDesc,
	standardDeviation,
} from './utils.js';

describe('getBitwiseValue', () => {
	it('should return empty array for undefined weight', () => {
		expect(getBitwiseValue(undefined, [1, 2, 4])).toEqual([]);
	});

	it('should return empty array for zero weight', () => {
		expect(getBitwiseValue(0, [1, 2, 4])).toEqual([]);
	});

	it('should return correct binary values for weight 5 (101 in binary)', () => {
		expect(getBitwiseValue(5, [1, 2, 4])).toEqual([1, 4]);
	});

	it('should return correct binary values for weight 7 (111 in binary)', () => {
		expect(getBitwiseValue(7, [1, 2, 4])).toEqual([1, 2, 4]);
	});

	it('should return correct binary values for weight 6 (110 in binary)', () => {
		expect(getBitwiseValue(6, [1, 2, 4])).toEqual([2, 4]);
	});
});

describe('standardDeviation', () => {
	it('should return 0 for empty array', () => {
		const result = standardDeviation([]);
		expect(result.stdDev).toBe(0);
		expect(result.variance).toBe(0);
	});

	it('should return 0 for single element', () => {
		const result = standardDeviation([5]);
		expect(result.stdDev).toBe(0);
		expect(result.variance).toBe(0);
	});

	it('should calculate correct standard deviation for [1, 2, 3, 4, 5]', () => {
		const result = standardDeviation([1, 2, 3, 4, 5]);
		// biome-ignore lint/suspicious/noApproximativeNumericConstant: OK
		expect(result.stdDev).toBeCloseTo(1.414, 2);
		expect(result.variance).toBe(2);
	});

	it('should calculate correct standard deviation for [10, 20, 30]', () => {
		const result = standardDeviation([10, 20, 30]);
		expect(result.stdDev).toBeCloseTo(8.165, 2);
		expect(result.variance).toBeCloseTo(66.667, 2);
	});
});

describe('sorting functions', () => {
	const mockPlaces: Partial<PlaceDocument>[] = [
		{ lat: 41.3851, lng: 2.1734 }, // Barcelona center
		{ lat: 41.4, lng: 2.2 }, // North-east
		{ lat: 41.37, lng: 2.15 }, // South-west
	];

	describe('sortByLatAsc', () => {
		it('should sort by latitude ascending (sea to mountain)', () => {
			const sorted = [...(mockPlaces as PlaceDocument[])].sort(sortByLatAsc);
			expect(sorted[0].lat).toBe(41.4);
			expect(sorted[2].lat).toBe(41.37);
		});
	});

	describe('sortByLatDesc', () => {
		it('should sort by latitude descending (mountain to sea)', () => {
			const sorted = [...(mockPlaces as PlaceDocument[])].sort(sortByLatDesc);
			expect(sorted[0].lat).toBe(41.37);
			expect(sorted[2].lat).toBe(41.4);
		});
	});

	describe('sortByLngAsc', () => {
		it('should sort by longitude ascending (tarragona to girona)', () => {
			const sorted = [...(mockPlaces as PlaceDocument[])].sort(sortByLngAsc);
			expect(sorted[0].lng).toBe(2.2);
			expect(sorted[2].lng).toBe(2.15);
		});
	});

	describe('sortByLngDesc', () => {
		it('should sort by longitude descending (girona to tarragona)', () => {
			const sorted = [...(mockPlaces as PlaceDocument[])].sort(sortByLngDesc);
			expect(sorted[0].lng).toBe(2.15);
			expect(sorted[2].lng).toBe(2.2);
		});
	});
});
