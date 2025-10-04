import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import PlacesService from '../../../service/places/places.service.js';

/**
 * Get a list of categories
 * @param req
 * @param res
 * @returns
 */
export default async function getPlaceCategories(_req: Request, res: Response) {
	const records = await PlacesService.getPlaceCategories();

	if (!records) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	return res.send(success(records));
}
