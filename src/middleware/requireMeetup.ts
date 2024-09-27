import type { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import {
	StatusCodes,
} from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { MeetupService } from "../service/meetup/meetup.service";

/** Curry middleware function - check that the meetup exists */
const requireMeetup = async (req: Request, res: Response, next: NextFunction) => {
  
  const theDocument = await MeetupService.getById({
    id: req.params.eventId,
  });

  if (!theDocument) {
    return res.status(StatusCodes.NOT_FOUND).send(
      error(
        'Item not found',
        res.statusCode,
      )
    );
  }

  // store the item for next handlers
  res.locals.meetup = theDocument;

  return next();
};

export default requireMeetup;
