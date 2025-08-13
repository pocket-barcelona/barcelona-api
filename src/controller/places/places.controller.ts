import type { Request, Response } from 'express';
import type { ReadExploreInput } from '../../schema/explore/explore.schema.js';
import type { ReadPlaceInput } from '../../schema/place/place.schema.js';
import {
	getById,
	getList,
	getPlaceCategories,
	getPlaceLookup,
	getRelatedPlaces,
	getSearchPrepopulate,
} from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PlacesController {
	static getListHandler = (
		req: Request<unknown, unknown, unknown, ReadExploreInput['body']>,
		res: Response
	) => getList(req, res);

	static getByIdHandler = (req: Request<ReadPlaceInput['params']>, res: Response) =>
		getById(req, res);

	static getRelatedPlacesHandler = (req: Request<ReadPlaceInput['params']>, res: Response) =>
		getRelatedPlaces(req, res);

	static getPlaceCategoriesHandler = (req: Request, res: Response) => getPlaceCategories(req, res);

	static searchPrepopulateHandler = (req: Request, res: Response) => getSearchPrepopulate(req, res);

	static getPlaceLookupHandler = (req: Request, res: Response) => getPlaceLookup(req, res);
}
