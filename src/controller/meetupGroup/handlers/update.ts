import type { Request, Response } from "express";
import type { UpdateMeetupGroupInput } from '../../../schema/meetupGroup/meetupGroup.schema';
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../../../models/auth/user.model";
import { MeetupGroupService } from "../../../service/meetupGroup/meetupGroup.service";
import type { MeetupGroupDocument } from '../../../models/meetupGroup.model';

/**
 * Patch a document by updating one or more fields
 * @param req
 * @param res
 */
export default async function update(
  req: Request<UpdateMeetupGroupInput["params"], unknown, UpdateMeetupGroupInput["body"]>,
  res: Response
) {
  const { groupId } = req.params;
  const documentExists = await MeetupGroupService.getById({
    groupId,
  });

  if (!documentExists) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Item not found", res.statusCode));
  }

  const loggedInUser = (res.locals.user as UserDocument).userId || "";
  // @todo - only allow super users or meetup group admins to edit items?
  if (documentExists.groupId !== loggedInUser) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(
        error("You do not have permission to edit this item", res.statusCode)
      );
  }

  const updatedDocument = await MeetupGroupService.update(groupId, req.body);
  if (!updatedDocument) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("The item could not be updated. Please try again later", res.statusCode));
  }

  return res.send(
    success<MeetupGroupDocument>(updatedDocument, {
      statusCode: res.statusCode,
    })
  );
}
