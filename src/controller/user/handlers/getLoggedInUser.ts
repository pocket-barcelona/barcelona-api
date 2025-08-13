import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { UserDocument } from '../../../models/auth/user.model.js';
import { UserService } from '../../../service/user/user.service.js';

export default async function getLoggedInUser(_req: Request, res: Response) {
	const email = (res.locals.user as UserDocument).email as string;
	// return user by email

	// get user
	let user = null;
	try {
		user = await UserService.getUserByEmail({
			email,
		});
	} catch (_e: unknown) {
		// logger.error(e);
	}

	if (!user) {
		return res.status(StatusCodes.NOT_FOUND).json(
			error(
				'The user does not exist or the account is invalid', // or some other error
				res.statusCode
			)
		);
	}

	return res.send(
		success<UserDocument>(user, {
			statusCode: res.statusCode,
		})
	);
}
