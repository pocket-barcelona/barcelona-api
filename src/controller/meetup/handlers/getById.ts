import type { Request, Response } from "express";
import type { ReadMeetupByIdInput } from "../../../schema/meetup/meetup.schema";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { MeetupService } from "../../../service/meetup/meetup.service";

/**
 * Get a document by ID
 * @param req
 * @param res
 * @param loggedIn If true, returns more information, such as responses list
 * @returns
 */
export default async function getById(
  req: Request<ReadMeetupByIdInput["params"]>,
  res: Response,
  loggedIn = true,
) {
  const { meetupId: id } = req.params;
  const document = await MeetupService.getById({ meetupId: id, loggedIn });

  if (!document) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Item not found", res.statusCode));
  }

  return res.send(success(document));
}
