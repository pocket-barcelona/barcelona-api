import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { error, success } from '../../../middleware/apiResponse.js';
import { type UserDocument, UserRoleEnum } from '../../../models/auth/user.model.js';
import type { MeetupDocument } from '../../../models/meetup.model.js';
import type { UpdateMeetupInput } from '../../../schema/meetup/meetup.schema.js';
import { MeetupService } from '../../../service/meetup/meetup.service.js';

/**
 * Patch a document by updating one or more fields
 * @param req
 * @param res
 */
export default async function update(
	req: Request<UpdateMeetupInput['params'], unknown, UpdateMeetupInput['body']>,
	res: Response
) {
	const { meetupId } = req.params;
	const documentExists = await MeetupService.getById({
		meetupId,
	});

	if (!documentExists) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Item not found', res.statusCode));
	}

	const loggedInUser = res.locals.user as UserDocument;
	const loggedInUserId = loggedInUser ? loggedInUser.userId : '';
	// @todo - only allow super users or meetup group admins to edit items?
	if (documentExists.groupId !== loggedInUserId && loggedInUser.role !== UserRoleEnum.Admin) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.send(error('You do not have permission to edit this item', res.statusCode));
	}

	const updatedDocument = await MeetupService.update(meetupId, req.body);
	if (!updatedDocument) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send(error('The item could not be updated. Please try again later', res.statusCode));
	}

	return res.send(
		success<MeetupDocument>(updatedDocument, {
			statusCode: res.statusCode,
		})
	);
}
