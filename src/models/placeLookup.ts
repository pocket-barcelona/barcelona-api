import type { PlaceDocument } from './place.model.js';

export type PlaceLookupDocument = Pick<PlaceDocument, 'labelCat' | 'placeId'>;
