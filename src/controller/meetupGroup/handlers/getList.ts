import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../../../models/auth/user.model";
import { MeetupGroupService } from "../../../service/meetupGroup/meetupGroup.service";

/**
 * Get a list of documents
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  const documents = await MeetupGroupService.getMeetupGroups();

  if (!documents) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(documents));
}
