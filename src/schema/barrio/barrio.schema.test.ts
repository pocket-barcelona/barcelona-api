import { describe, expect, it } from 'vitest';
import { readBarrioSchema } from './barrio.schema.js';

describe('readBarrioSchema', () => {
	it('should validate with valid regionId', () => {
		const result = readBarrioSchema.safeParse({
			query: { regionId: '123' },
		});
		expect(result.success).toBe(true);
	});

	it('should validate without regionId', () => {
		const result = readBarrioSchema.safeParse({
			query: {},
		});
		expect(result.success).toBe(true);
	});

	it('should validate with empty query', () => {
		const result = readBarrioSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it('should fail with invalid regionId type', () => {
		const result = readBarrioSchema.safeParse({
			query: { regionId: 123 },
		});
		expect(result.success).toBe(false);
	});
});
