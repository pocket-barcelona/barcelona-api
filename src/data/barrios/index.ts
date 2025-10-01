type LatLng = {
	lat: number;
	lng: number;
};

export type Barris = {
	id: string;
	nom: string;
	centre: LatLng;
	color: string;
	area: LatLng[];
};
export type BarrioData = {
	styles: {
		featureType: string;
		elementType: string;
		stylers: {
			color?: string;
			visibility?: string;
		}[];
	}[];
	barris: Barris[];
};

import ciutatVella from './ciutat-vella.js';
import eixample from './eixample.js';
import gracia from './gracia.js';
import hortaGuinardo from './horta-guinardo.js';
import lesCorts from './les-corts.js';
import nouBarris from './nou-barris.js';
import santAndreu from './sant-andreu.js';
import santMarti from './sant-marti.js';
import santsMontjuic from './sants-montjuic.js';
import sarriaSantGervasi from './sarria-santgervasi.js';

export default {
	CiutatVella: ciutatVella as BarrioData,
	Eixample: eixample as BarrioData,
	Gracia: gracia as BarrioData,
	HortaGuinardo: hortaGuinardo as BarrioData,
	LesCorts: lesCorts as BarrioData,
	NouBarris: nouBarris as BarrioData,
	SantAndreu: santAndreu as BarrioData,
	SantMarti: santMarti as BarrioData,
	SantsMontjuic: santsMontjuic as BarrioData,
	SarriaSantGervasi: sarriaSantGervasi as BarrioData,
};
