import type { PlaceDocument } from './place.model.js';

export type PlaceSearchDocument = Pick<
	PlaceDocument,
	'labelCat' | 'labelEsp' | 'labelEng' | 'description' | 'placeId' | 'slug' | 'tags' | 'barrioId'
>;
