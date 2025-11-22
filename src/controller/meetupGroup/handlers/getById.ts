import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../middleware/apiResponse.js';
import type { ReadMeetupGroupByIdInput } from '../../../schema/meetupGroup/meetupGroup.schema.js';
import MeetupGroupService from '../../../service/meetupGroup/meetupGroup.service.js';

/**
 * Get a document by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(
	req: Request<ReadMeetupGroupByIdInput['params']>,
	res: Response
) {
	const { groupId } = req.params;
	/** @todo If true, returns more information, such as rsvp's list */
	const loggedIn = Boolean(res.locals.user);
	const document = await MeetupGroupService.getById({ groupId, loggedIn });

	if (!document) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Item not found', res.statusCode));
	}

	return res.send(success(document));
}
