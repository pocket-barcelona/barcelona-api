import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import { EventsService } from "../../../service/events/events.service";

/**
 * Get a list of events
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
	const data = await EventsService.getList();

	if (!data) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Error getting list", res.statusCode));
	}

	return res.send(success(data));
}
