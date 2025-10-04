import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../../middleware/apiResponse.js';
import type { UserDocument } from '../../../../models/auth/user.model.js';
import { type MeetupDocument, MeetupStatusEnum } from '../../../../models/meetup.model.js';
import type { MeetupRsvpModel } from '../../../../models/rsvp.model.js';
import type { CreateRsvpInput, UpdateRsvpInput } from '../../../../schema/meetup/rsvp.schema.js';
import { RsvpService } from '../../../../service/rsvp/rsvp.service.js';

/**
 * Update a meetup rsvp response
 * @param req
 * @param res
 * @returns
 */
export default async function updateRsvp(
	req: Request<UpdateRsvpInput['params'], never, CreateRsvpInput['body']>, // the event already exists, so we need the ID from the request
	res: Response
) {
	// 1. check if the event is open to responses, based on status (@todo - also cannot submit response after a certain date?)
	// 2. get response by response ID
	// 3. if exists, update the response

	// const { meetupId, rsvpId } = req.params;

	// user may or may not be logged in

	// default to anonymous users
	let userId = '';
	if (res.locals?.user) {
		const uId = (res.locals.user as UserDocument).userId.toString();
		if (uId) {
			userId = uId;
		}
	}

	// get event from middleware locals
	const theEvent = res.locals.event as MeetupDocument;

	const allowedToAddAResponse = [MeetupStatusEnum.Published].includes(theEvent.status);
	if (!allowedToAddAResponse) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.send(
				error(
					'It is not possible to respond to this event. The event status does not permit the operation.',
					res.statusCode
				)
			);
	}

	const responseUserId = !userId ? '' : userId.toString();

	// add or update the response attendance data
	const updatedResponse = await RsvpService.updateResponse(theEvent, req, responseUserId);

	if (updatedResponse) {
		// for security, do not send back the whole event as it potentially contains a lot of info

		return res.send(
			success<MeetupRsvpModel>(updatedResponse, {
				statusCode: res.statusCode,
			})
		);
	}
	return res
		.status(StatusCodes.BAD_REQUEST)
		.send(
			error('Invalid data. Could not update the attendance data for the event', res.statusCode)
		);
}
