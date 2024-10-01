import type { Request, Response } from "express";
import type { UpdateMeetupInput } from "../../../schema/meetup/meetup.schema";
import { error, success } from "../../../middleware/apiResponse";
import type { MeetupDocument } from "../../../models/meetup.model";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../../../models/auth/user.model";
import { MeetupService } from "../../../service/meetup/meetup.service";

/**
 * Patch a document by updating one or more fields
 * @param req
 * @param res
 */
export default async function update(
  req: Request<UpdateMeetupInput["params"], unknown, UpdateMeetupInput["body"]>,
  res: Response
) {
  const { eventId } = req.params;
  const documentExists = await MeetupService.getById({
    id: eventId,
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

  const updatedDocument = await MeetupService.update(eventId, req.body);
  if (!updatedDocument) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("The item could not be updated. Please try again later", res.statusCode));
  }

  return res.send(
    success<MeetupDocument>(updatedDocument, {
      statusCode: res.statusCode,
    })
  );
}
