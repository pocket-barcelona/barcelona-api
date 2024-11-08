import type { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import { StatusCodes } from "http-status-codes";
import { MeetupStatusEnum, type MeetupDocument } from "../models/meetup.model";
import type { UserDocument } from "../models/auth/user.model";
import type { CreateRsvpInput } from '../schema/meetup/rsvp.schema';
import { MeetupRsvpAttendanceStatusEnum } from '../models/rsvp.model';

const MINIMUM_MOBILE_NUMBER_LENGTH = 9;

/** Curry middleware function - check that the meetup accepts rsvps with given payload */
const requireCanRsvp = async (
  req: Request<CreateRsvpInput["params"], unknown, CreateRsvpInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  const { body } = req;
  const { meetup, user } = res.locals as {
    meetup: MeetupDocument;
    user: UserDocument | undefined;
  };
  const { eventConfig, rsvps = [], rsvpType, price } = meetup;
  const { maxAttendees, requiresEmailAddress, requiresMobileNumber, requiresVerifiedUser } = eventConfig ?? {};
  const now = Date.now();

  if (!meetup) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error - Meetup not found!", res.statusCode));
  }

  const allowedToAddAResponse = [
    MeetupStatusEnum.Provisional,
    MeetupStatusEnum.Published,
  ].includes(meetup.status);
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

  // make sure the host is not rsvping to their own event
  // Note: the group organiser CAN rsvp to their event
  const hostIsRespondingToOwnEvent = user?.userId && (meetup.hosts ?? []).some(h => h.userId === user.userId);
  if (hostIsRespondingToOwnEvent) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(
        error(
          "It is not possible to respond to your own event.",
          res.statusCode
        )
      );
  }

  // make sure the meetup is not in the past
  if (meetup.endTime !== undefined) {
    const eventDate = new Date(meetup.endTime).getTime();
    if (now > eventDate) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(
          error(
            "It is not possible to respond to this event. The event has already taken place.",
            res.statusCode
          )
        );
    }
  }

  // make sure rsvp-ing is open (and not close) rsvpOpensAt / rsvpClosesAt
  if (meetup.rsvpOpensAt !== undefined) {
    // make sure is open
    const rsvpOpensAt = new Date(meetup.rsvpOpensAt).getTime();
    if (now < rsvpOpensAt) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(
          error(
            "It is not possible to respond to this event. The event has not yet opened for RSVPs.",
            res.statusCode
          )
        );
    }
  }

  if (meetup.rsvpClosesAt !== undefined) {
    const rsvpClosesAt = new Date(meetup.rsvpClosesAt).getTime();
    if (now > rsvpClosesAt) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(
          error(
            "It is not possible to respond to this event. The event has closed for RSVPs.",
            res.statusCode
          )
        );
    }
  }
  
  // make sure rsvps.length is ok with maxAttendees
  if (maxAttendees !== undefined && maxAttendees !== 0) {
    // @todo - give users priority over anonymous users
    const confirmedGuests = rsvps.filter(r => r.attendanceStatus === MeetupRsvpAttendanceStatusEnum.Coming);
    // const maybeGuests = rsvps.filter(r => r.attendanceStatus === MeetupRsvpAttendanceStatusEnum.Maybe);
    if (confirmedGuests.length >= maxAttendees) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .send(
          error(
            "It is not possible to respond to this event. The event has reached the maximum number of attendees.",
            res.statusCode
          )
        );
    }
  }

  // make sure the response given matches the MeetupRsvpCertainty
  if (rsvpType === 'DEFINITE' && body.response === MeetupRsvpAttendanceStatusEnum.Maybe) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        error(
          "The meetup requires a definite response - only Coming or Not Coming are valid options.",
          res.statusCode
        )
      );
  }

  if (body.guests.length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        error(
          "You must provide valid attendee information for this event",
          res.statusCode
        )
      );
  }

  const hasOnlyOneMainGuest = body.guests.filter(g => g.isMainGuest === true).length === 1;
  if (!hasOnlyOneMainGuest) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        error(
          "You must provide exactly one main guest for this event",
          res.statusCode
        )
      );
  }

  // @todo - check requiresEmailAddress?

  if (requiresMobileNumber && !body.guests.every(g => (g?.mobile ?? '').length > MINIMUM_MOBILE_NUMBER_LENGTH)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(
        error(
          "You must provide a valid mobile number for this event",
          res.statusCode
        )
      );
  }

  // make sure user is logged in, if event config requires it
  if (requiresVerifiedUser && !user) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(
        error(
          "You must be logged in as a verified user before you can RSVP to this event.",
          res.statusCode
        )
      );
  }

  // user may or may not be logged in
  // default to anonymous users
  let userId = "";
  if (user) {
    const uId = user.userId;
    if (uId) {
      userId = uId;
    }
  }

  
  // make sure meetup price is met
  // @todo - V2


  // @todo - check if the user has already posted a response? (requires userId in POST)
  return next();
};

export default requireCanRsvp;
