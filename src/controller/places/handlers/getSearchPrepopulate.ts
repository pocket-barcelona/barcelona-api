import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { PlaceDocument } from '../../../models/place.model.js';
import PlacesService from '../../../service/places/places.service.js';

/**
 * Get a list of place Ids for searching
 * @param req
 * @param res
 * @returns
 */
export default async function getSearchPrepopulate(_req: Request, res: Response) {
	const scanResp = await PlacesService.getSearchPrepopulate();
	const records: PlaceDocument[] = scanResp ? (scanResp.toJSON() as PlaceDocument[]) : [];

	if (!records) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting items', res.statusCode));
	}
	const mappedRecords = PlacesService.getMappedSearchPlace(records);

	return res.send(success(mappedRecords));
}
