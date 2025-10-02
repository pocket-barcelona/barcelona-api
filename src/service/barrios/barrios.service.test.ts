import * as geolib from 'geolib';
import { describe, expect, it, vi } from 'vitest';
import { findBarrioByLatLng } from './barrios.service.js';

vi.mock('geolib');
vi.mock('../../data/barrios/index.js', () => ({
	default: {
		CiutatVella: {
			barris: [{ id: 1, name: 'Test Barrio 1', area: [{ lat: 41.38, lng: 2.17 }] }],
		},
		Eixample: { barris: [] },
		Gracia: { barris: [] },
		HortaGuinardo: { barris: [] },
		LesCorts: { barris: [] },
		NouBarris: { barris: [] },
		SantAndreu: { barris: [] },
		SantMarti: { barris: [] },
		SantsMontjuic: { barris: [] },
		SarriaSantGervasi: { barris: [] },
	},
}));

describe('findBarrioByLatLng', () => {
	it('should return barrio when point is inside polygon', () => {
		vi.mocked(geolib.isPointInPolygon).mockReturnValue(true);

		const result = findBarrioByLatLng(41.38, 2.17);

		expect(result).toEqual({ id: 1, name: 'Test Barrio 1', area: [{ lat: 41.38, lng: 2.17 }] });
		expect(geolib.isPointInPolygon).toHaveBeenCalledWith({ lat: 41.38, lng: 2.17 }, [
			{ lat: 41.38, lng: 2.17 },
		]);
	});

	it('should return null when point is outside all polygons', () => {
		vi.mocked(geolib.isPointInPolygon).mockReturnValue(false);

		const result = findBarrioByLatLng(41.38, 2.17);

		expect(result).toBeNull();
	});

	it('should return first matching barrio when multiple matches', () => {
		vi.mocked(geolib.isPointInPolygon).mockReturnValue(true);

		const result = findBarrioByLatLng(41.38, 2.17);

		expect(result).toEqual({ id: 1, name: 'Test Barrio 1', area: [{ lat: 41.38, lng: 2.17 }] });
	});
});
