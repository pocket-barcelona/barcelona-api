import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import type { CreateRsvpInput } from '../schema/meetup/rsvp.schema.js';
import { MeetupService } from '../service/meetup/meetup.service.js';
import { error } from './apiResponse.js';

/** Curry middleware function - check that the meetup exists */
const requireMeetup = async (
	req: Request<CreateRsvpInput['params']>,
	res: Response,
	next: NextFunction
) => {
	const { meetupId } = req.params;
	const theDocument = await MeetupService.getById({
		meetupId,
	});

	if (!theDocument) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Meetup not found', res.statusCode));
	}

	// store the item for next handlers
	res.locals.meetup = theDocument;

	return next();
};

export default requireMeetup;
