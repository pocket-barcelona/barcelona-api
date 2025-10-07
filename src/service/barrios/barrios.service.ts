import { isPointInPolygon } from 'geolib';
import Barrios, { type Barris } from '../../data/barrios/index.js';
import { getListHandler, getRegionsListHandler } from './functions/index.js';

export default {
	getRegionsList: getRegionsListHandler,
	getList: getListHandler,
	// TODO - static lookup is here: src/collections/barrios/data.ts
};

const BARRIO_DATA = [
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

export function findBarrioByLatLng(lat: number, lng: number): Barris | null {
	for (const { barris } of BARRIO_DATA) {
		for (const barrio of barris) {
			if (isPointInPolygon({ lat, lng }, barrio.area)) {
				return barrio;
			}
		}
	}
	return null;
}
