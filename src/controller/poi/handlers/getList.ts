import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { FilterByPoiInput } from '../../../schema/poi/poi.schema.js';
import { PoiService } from '../../../service/poi/poi.service.js';

/**
 * Get a list of points of interest
 * @param req
 * @param res
 * @returns
 */
export default async function getList(
	req: Request<any, any, any, FilterByPoiInput>,
	res: Response
) {
	const data = await PoiService.getList(req.body);

	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	return res.send(success(data));
}
