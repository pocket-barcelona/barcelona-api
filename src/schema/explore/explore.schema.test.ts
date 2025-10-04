import { describe, expect, it } from 'vitest';
import { exploreSchema } from './explore.schema.js';

describe('exploreSchema', () => {
	it('should validate empty body', () => {
		const result = exploreSchema.safeParse({ body: {} });
		expect(result.success).toBe(true);
	});

	it('should validate with valid array fields', () => {
		const result = exploreSchema.safeParse({
			body: {
				provinceId: [1, 2],
				barrioId: [10, 20],
				categoryId: [5],
				exclude: [1, 2, 3],
				include: [4, 5],
				tags: ['tag1', 'tag2'],
			},
		});
		expect(result.success).toBe(true);
	});

	it('should validate with valid string fields', () => {
		const result = exploreSchema.safeParse({
			body: {
				town: 'Barcelona',
				keyword: 'restaurant',
				poi: '41.3851,2.1734',
				orderBy: 'name',
			},
		});
		expect(result.success).toBe(true);
	});

	it('should validate with valid number fields', () => {
		const result = exploreSchema.safeParse({
			body: {
				price: 2,
				timeRecommended: 120,
				bestTod: 1,
				commitmentRequired: 0,
				childrenSuitability: 1,
				teenagerSuitability: 1,
				requiresBooking: 0,
				metroZone: 1,
				daytrip: 0,
				page: 1,
				pageSize: 20,
			},
		});
		expect(result.success).toBe(true);
	});

	it('should validate with valid boolean fields', () => {
		const result = exploreSchema.safeParse({
			body: {
				popular: true,
				seasonal: false,
				availableSundays: true,
			},
		});
		expect(result.success).toBe(true);
	});

	it('should fail with invalid array types', () => {
		const result = exploreSchema.safeParse({
			body: { provinceId: 'invalid' },
		});
		expect(result.success).toBe(false);
	});

	it('should fail with invalid number types', () => {
		const result = exploreSchema.safeParse({
			body: { price: 'invalid' },
		});
		expect(result.success).toBe(false);
	});

	it('should fail with invalid boolean types', () => {
		const result = exploreSchema.safeParse({
			body: { popular: 'invalid' },
		});
		expect(result.success).toBe(false);
	});
});
