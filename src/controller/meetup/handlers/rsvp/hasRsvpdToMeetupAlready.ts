import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../../middleware/apiResponse.js';
import type { UserDocument } from '../../../../models/auth/user.model.js';
import type { MeetupDocument } from '../../../../models/meetup.model.js';
import type { CreateRsvpInput } from '../../../../schema/meetup/rsvp.schema.js';
import { RsvpService } from '../../../../service/rsvp/rsvp.service.js';

/**
 * Check if user has responded to this meetup event or not yet
 * Note: User could be logged in or not!
 * @param req
 * @param res
 */
export default async function hasRsvpdToMeetupAlready(
	req: Request<
		CreateRsvpInput['params'],
		never,
		{
			rsvpId: string;
		}
	>,
	res: Response
) {
	// get event from middleware locals
	const theEvent = res.locals.event as MeetupDocument;

	const { rsvpId } = req.body;

	// check if the user is logged in, manually
	// responses can be from not-logged in users, so allow user ID to not exist
	// @todo - make a middleware for this if needed again?
	let userId = '';
	if (res.locals?.user?.userId) {
		const theUserId = (res.locals.user as UserDocument).userId.toString();
		if (theUserId) {
			userId = theUserId;
		}
	}

	const matchedResponseId = await RsvpService.hasRsvpdToMeetupYet(theEvent, userId, rsvpId);

	return res.send(
		success<{
			responseId: string | null;
		}>(
			{
				responseId: matchedResponseId ? matchedResponseId : null,
			},
			{
				statusCode: res.statusCode,
			}
		)
	);
}
