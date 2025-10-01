import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import GoogleCalendarService, {
	OLDEST_PB_EVENT,
} from '../../../service/calendar/googleCalendar.service.js';

/**
 * Get a list of Google calendar events
 * @param req
 * @param res
 * @returns
 */
export default async function getList(_req: Request, res: Response) {
	const data = await GoogleCalendarService.listEvents(OLDEST_PB_EVENT, 100);

	if (!data) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error('Error getting Google list', res.statusCode));
	}

	return res.send(success(data));
}
