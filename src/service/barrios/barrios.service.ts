import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import { isPointInPolygon } from 'geolib';
import Barrios, { type Barris } from '../../data/barrios/index.js';
import type { BarrioDocument } from '../../models/barrio.model.js';
import type { ReadBarrioInput } from '../../schema/barrio/barrio.schema.js';
import { getListHandler, getRegionsListHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: TODO
export class BarriosService {
	static getRegionsList = async (): Promise<ScanResponse<BarrioDocument> | null> =>
		getRegionsListHandler();

	static getList = async (
		queryParams?: ReadBarrioInput['query']
	): Promise<ScanResponse<BarrioDocument> | null> => getListHandler(queryParams);
}

export function findBarrioByLatLng(lat: number, lng: number): Barris | null {
	const data = [
		Barrios.CiutatVella,
		Barrios.Eixample,
		Barrios.Gracia,
		Barrios.HortaGuinardo,
		Barrios.LesCorts,
		Barrios.NouBarris,
		Barrios.SantAndreu,
		Barrios.SantAndreu,
		Barrios.SantMarti,
		Barrios.SantsMontjuic,
		Barrios.SarriaSantGervasi,
	];

	let found: Barris | null = null;

	data.forEach(({ barris }) => {
		barris.forEach((barrio) => {
			// const isInside = isInsidePolygon({ lat, lng }, barrio.area);
			const isInside = isPointInPolygon({ lat, lng }, barrio.area);
			if (isInside) {
				found = barrio;
				return barrio;
			}
		});
	});

	return found;
}
