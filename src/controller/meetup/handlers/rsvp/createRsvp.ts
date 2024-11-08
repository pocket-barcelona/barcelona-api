import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../../middleware/apiResponse';
import { type MeetupDocument, MeetupStatusEnum } from "../../../../models/meetup.model";
import type { CreateRsvpInput } from "../../../../schema/meetup/rsvp.schema";
import UserModel, { type UserDocument } from "../../../../models/auth/user.model";
import { RsvpService } from "../../../../service/rsvp/rsvp.service";
import { type MeetupRsvpModel, getAttendanceStatusHumanMessage } from '../../../../models/rsvp.model';
import { MeetupService } from '../../../../service/meetup/meetup.service';

/**
 * Create a new rsvp response to the meetup event
 * @param req
 * @param res
 * @returns
 */
export default async function createRsvp(
  req: Request<CreateRsvpInput["params"], unknown, CreateRsvpInput["body"]>, // the event already exists, so we need the ID from the request
  res: Response
) {
  const { meetup, user } = res.locals as {
    meetup: MeetupDocument;
    user: UserDocument | undefined;
  };

  // check for logged in user, which will be the user ID of the
  // const responseUserId = !userId ? "" : userId.toString();

  // if (responseUserId) {
  //   // make sure this logged in user has not already left a response
  //   if (
  //     theEventJson.responses.some((r) => r.attendeeUserId === responseUserId)
  //   ) {
  //     return res
  //       .status(StatusCodes.FORBIDDEN)
  //       .send(
  //         error("You have already responded to this event", res.statusCode)
  //       );
  //   }
  // }

  // logged in host is trying to respond to their own event
  // const groupOwnerIsRespondingToOwnEvent =
  //   user?.userId !== "" && user?.userId === meetup.organiser.userId;
  const groupOwnerIsRespondingToOwnEvent = false;

  // add or update the response attendance data
  const createdRsvp = await RsvpService.createRsvp(
    meetup,
    req,
    ""
    // responseUserId
    // we don't handle "logged in users responses" yet,
    // every response is handled as anonymus in terms of our users (hosts)
  );

  if (!createdRsvp) {
    return res
    .status(StatusCodes.BAD_REQUEST)
    .send(
      error(
        "Error creating your RSVP data for the event, please try again later.",
        res.statusCode,
      )
    );
  }

  // only send an email if it's not the host
  // if (!groupOwnerIsRespondingToOwnEvent) {
  //   // type safety on userId document prop name
  //   const userIdField: keyof Pick<UserDocument, "userId"> = "userId";

  //   // @todo - MeetupGroupModel.scan()...
  //   const hostData = await UserModel.scan()
  //     .where(userIdField)
  //     .eq(meetup.groupId)
  //     .exec()
  //     .catch((err: unknown) => {
  //       return null;
  //     });

  //   const host: UserDocument | null =
  //     hostData && hostData?.length > 0 ? hostData[0] : null;
  //   if (host) {
  //     await RsvpService.notifyMeetupHost(meetup, {
  //       name: createdRsvp.name,
  //       response: getAttendanceStatusHumanMessage(
  //         createdRsvp.response
  //       ),
  //       comment: createdRsvp.comment || "",
  //       hostEmail: host.email,
  //     });
  //   }
  // }

  // for security, do not send back the whole event as it potentially contains a lot of info
  // user response is just a copy of what they posted
  return res.send(
    success<MeetupRsvpModel>(createdRsvp, {
      statusCode: res.statusCode,
    })
  );

  
}
