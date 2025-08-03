import type { Request, Response } from "express";
import type { CreateMeetupInput } from "../../../schema/meetup/meetup.schema";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../../../models/auth/user.model";
import { MeetupService } from "../../../service/meetup/meetup.service";

/**
 * Create a new document
 * @param req
 * @param res
 * @returns The new document
 */
export default async function create(
  req: Request<unknown, unknown, CreateMeetupInput["body"]>,
  res: Response
) {
  // host ID is the user logged in - for now
  const userId = (res.locals.user as UserDocument).userId;

  const newDocument = await MeetupService.create(req.body, userId.toString());

  // send a useful data validation message
  if (typeof newDocument === "string") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error(newDocument, res.statusCode));
  }

  if (newDocument) {
    return res.send(success(newDocument));
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .send(error("Invalid data", res.statusCode));
}
