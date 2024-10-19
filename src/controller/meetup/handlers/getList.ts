import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { MeetupService } from "../../../service/meetup/meetup.service";
import type { GetMeetupsInput } from '../../../schema/meetup/meetup.schema';
import type { UserDocument } from "../../../models/auth/user.model";

/**
 * Get a list of documents
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request<GetMeetupsInput['params']>, res: Response) {
  // host ID is the user logged in - for now
  // const hostId = (res.locals.user as UserDocument).userId;
  const { groupId } = req.params;
  
  const documents = await MeetupService.getMeetups(groupId.toString());

  if (!documents) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(documents));
}
