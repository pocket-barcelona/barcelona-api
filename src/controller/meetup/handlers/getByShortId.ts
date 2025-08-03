import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { error, success } from "../../../middleware/apiResponse";
import type { ReadMeetupByShortIdInput } from "../../../schema/meetup/meetup.schema";
import { MeetupService } from "../../../service/meetup/meetup.service";

/**
 * Get a document by short ID
 * @param req
 * @param res
 * @param loggedIn If true, returns more information, such as responses list
 * @returns
 */
export default async function getByShortId(
	req: Request<ReadMeetupByShortIdInput["params"]>,
	res: Response,
) {
	const { meetupShortId: shortId } = req.params;
	const document = await MeetupService.getByShortId({ shortId });

	if (!document) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Item not found", res.statusCode));
	}

	return res.send(success(document));
}
