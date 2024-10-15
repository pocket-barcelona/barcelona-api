import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../../middleware/apiResponse';
import { type MeetupDocument, MeetupStatusEnum } from "../../../../models/meetup.model";
import type { CreateRsvpInput } from "../../../../schema/meetup/rsvp.schema";
import UserModel, { type UserDocument } from "../../../../models/auth/user.model";
import { RsvpService } from "../../../../service/rsvp/rsvp.service";
import { type MeetupRsvpModel, getAttendanceStatusHumanMessage } from '../../../../models/rsvp.model';

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
  // 1. check if the event is open to responses, based on status (@todo - also cannot submit response after a certain date?)
  // 2. check if the user has already posted a response? (requires userId in POST)
  // 3. add the response to the document and return the whole event doc

  const { meetupId } = req.params;

  // user may or may not be logged in

  // default to anonymous users
  let userId = "";
  if (res.locals?.user) {
    const uId = (res.locals.user as UserDocument).userId.toString();
    if (uId) {
      userId = uId;
    }
  }

  // get event from middleware locals
  const theEvent = res.locals.event as MeetupDocument;
  const theEventJson = theEvent.toJSON() as MeetupDocument;

  const allowedToAddAResponse = [MeetupStatusEnum.Published].includes(
    theEvent.status
  );
  if (!allowedToAddAResponse) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(
        error(
          "It is not possible to respond to this event. The event status does not permit the operation.",
          res.statusCode
        )
      );
  }

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
  const hostIsRespondingToOwnEvent =
    userId !== "" && userId === theEvent.groupId;

  // add or update the response attendance data
  const userResponse = await RsvpService.createRsvp(
    theEvent,
    req,
    ""
    // responseUserId
    // we don't handle "logged in users responses" yet,
    // every response is handled as anonymus in terms of our users (hosts)
  );

  if (userResponse) {
    // only send an email if it's not the host
    if (!hostIsRespondingToOwnEvent) {
      // type safety on userId document prop name
      const userIdField: keyof Pick<UserDocument, "userId"> = "userId";

      // @todo - MeetupGroupModel.scan()...
      const hostData = await UserModel.scan()
        .where(userIdField)
        .eq(theEvent.groupId)
        .exec()
        .catch((err: unknown) => {
          return null;
        });

      const host: UserDocument | null =
        hostData && hostData?.length > 0 ? hostData[0] : null;
      if (host) {
        await RsvpService.notifyMeetupHost(theEvent, {
          name: userResponse.attendeeName,
          response: getAttendanceStatusHumanMessage(
            userResponse.attendanceStatus
          ),
          comment: userResponse.comment || "",
          hostEmail: host.email,
        });
      }
    }

    // for security, do not send back the whole event as it potentially contains a lot of info
    // user response is just a copy of what they posted
    return res.send(
      success<MeetupRsvpModel>(userResponse, {
        statusCode: res.statusCode,
      })
    );
  }

  return res
    .status(StatusCodes.BAD_REQUEST)
    .send(
      error(
        "Invalid data. Could not update the attendance data for the event",
        res.statusCode
      )
    );
}
