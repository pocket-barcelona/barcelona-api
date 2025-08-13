import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../middleware/apiResponse.js';
import type { ReadMeetupByIdInput } from '../../../schema/meetup/meetup.schema.js';
import { MeetupService } from '../../../service/meetup/meetup.service.js';

/**
 * Get a document by ID
 * @param req
 * @param res
 * @param loggedIn If true, returns more information, such as responses list
 * @returns
 */
export default async function getById(
	req: Request<ReadMeetupByIdInput['params']>,
	res: Response,
	loggedIn = true
) {
	const { meetupId } = req.params;
	const document = await MeetupService.getById({ meetupId, loggedIn });

	if (!document) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Item not found', res.statusCode));
	}

	return res.send(success(document));
}
