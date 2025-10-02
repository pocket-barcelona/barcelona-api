import { isPointInPolygon } from 'geolib';
import Barrios, { type Barris } from '../../data/barrios/index.js';
import { getListHandler, getRegionsListHandler } from './functions/index.js';

export default {
	getRegionsList: getRegionsListHandler,
	getList: getListHandler,
};

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
			const isInside = isPointInPolygon({ lat, lng }, barrio.area);
			if (isInside) {
				found = barrio;
				return barrio;
			}
		});
	});

	return found;
}
