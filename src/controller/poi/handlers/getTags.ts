import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import PoiService from '../../../service/poi/poi.service.js';

/**
 * Get a list of restaurant tags for points of interest
 * @param req
 * @param res
 * @returns
 */
export default async function getTags(_req: Request, res: Response) {
	const data = await PoiService.getTags();

	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	return res.send(success(data));
}
