import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import { BarriosService } from '../../../service/barrios/barrios.service.js';

/**
 * Get a list of barrio top-level barrio regions
 * @param req
 * @param res
 * @returns
 */
export default async function getRegionsList(_req: Request, res: Response) {
	const data = await BarriosService.getRegionsList();

	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	return res.send(success(data));
}
