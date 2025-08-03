import type { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { MeetupService } from "../service/meetup/meetup.service";
import type { CreateRsvpInput } from "../schema/meetup/rsvp.schema";

/** Curry middleware function - check that the meetup exists */
const requireMeetup = async (
  req: Request<CreateRsvpInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  const { meetupId } = req.params;
  const theDocument = await MeetupService.getById({
    meetupId,
  });

  if (!theDocument) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Meetup not found", res.statusCode));
  }

  // store the item for next handlers
  res.locals.meetup = theDocument;

  return next();
};

export default requireMeetup;
