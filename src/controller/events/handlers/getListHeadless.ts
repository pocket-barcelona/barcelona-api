import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import { CalendarService } from '../../../service/calendar/calendar.service.js';

/**
 * @deprecated
 * Get a list of calendar events from Directus
 * @param req
 * @param res
 * @returns
 */
export default async function getListHeadless(_req: Request, res: Response) {
	const data = await CalendarService.getHeadlessList();

	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	return res.send(success(data));
}
