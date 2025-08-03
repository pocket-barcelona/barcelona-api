import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import type { ReadCalendarEventInput } from "../../../schema/event/calendar.schema";
import GoogleCalendarService from "../../../service/calendar/googleCalendar.service";

/**
 * Get a google calendar event's instance by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getInstancesById(
	req: Request<ReadCalendarEventInput["params"]>,
	res: Response,
) {
	if (!req.params.id) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(
				error(
					"Please provide an ID - must be a Google event ID (not iCalUID)",
					res.statusCode,
				),
			);
	}

	const { id } = req.params;
	const records = await GoogleCalendarService.getEventInstances(id);

	if (!records) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Error getting instance item/s", res.statusCode));
	}

	return res.send(success(records));
}
