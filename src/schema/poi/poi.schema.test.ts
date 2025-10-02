import { describe, expect, it } from 'vitest';
import {
	createPoiSchema,
	deletePoiSchema,
	filterByPoiSchema,
	readPoiSchema,
	updatePoiSchema,
} from './poi.schema.js';

describe('filterByPoiSchema', () => {
	it('should validate with required barrioId', () => {
		const result = filterByPoiSchema.safeParse({
			body: { barrioId: [1, 2] },
		});
		expect(result.success).toBe(true);
	});

	it('should validate with all optional fields', () => {
		const result = filterByPoiSchema.safeParse({
			body: {
				lat: 41.3851,
				lng: 2.1734,
				price: 2,
				barrioId: [1],
				tagId: ['tag1', 'tag2'],
			},
		});
		expect(result.success).toBe(true);
	});

	it('should fail without barrioId', () => {
		const result = filterByPoiSchema.safeParse({
			body: {},
		});
		expect(result.success).toBe(false);
	});

	it('should fail with empty barrioId array', () => {
		const result = filterByPoiSchema.safeParse({
			body: { barrioId: [] },
		});
		expect(result.success).toBe(false);
	});
});

describe('createPoiSchema', () => {
	it('should validate empty body', () => {
		const result = createPoiSchema.safeParse({
			body: {},
		});
		expect(result.success).toBe(true);
	});
});

describe('readPoiSchema', () => {
	it('should validate with valid poiId', () => {
		const result = readPoiSchema.safeParse({
			params: { poiId: '123' },
		});
		expect(result.success).toBe(true);
	});

	it('should fail without poiId', () => {
		const result = readPoiSchema.safeParse({
			params: {},
		});
		expect(result.success).toBe(false);
	});
});

describe('updatePoiSchema', () => {
	it('should validate with poiId and empty body', () => {
		const result = updatePoiSchema.safeParse({
			params: { poiId: '123' },
			body: {},
		});
		expect(result.success).toBe(true);
	});
});

describe('deletePoiSchema', () => {
	it('should validate with valid poiId', () => {
		const result = deletePoiSchema.safeParse({
			params: { poiId: '123' },
		});
		expect(result.success).toBe(true);
	});

	it('should fail without poiId', () => {
		const result = deletePoiSchema.safeParse({
			params: {},
		});
		expect(result.success).toBe(false);
	});
});
