import type { Request, Response } from "express";
import type { ReadMeetupGroupByIdInput } from '../../../schema/meetupGroup/meetupGroup.schema';
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { MeetupGroupService } from "../../../service/meetupGroup/meetupGroup.service";

/**
 * Get a document by ID
 * @param req
 * @param res
 * @param loggedIn If true, returns more information, such as responses list
 * @returns
 */
export default async function getById(
  req: Request<ReadMeetupGroupByIdInput["params"]>,
  res: Response,
  loggedIn = true,
) {
  const { groupId } = req.params;
  const document = await MeetupGroupService.getById({ groupId, loggedIn });

  if (!document) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Item not found", res.statusCode));
  }

  return res.send(success(document));
}
