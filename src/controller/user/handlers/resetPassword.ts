import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import {
	CheckResetTokenEnum,
	type UserDocument,
} from "../../../models/auth/user.model";
import type { ResetPasswordUserInput } from "../../../schema/user/reset-password.schema";
import { UserService } from "../../../service/user/user.service";

export default async function resetPassword(
	req: Request<unknown, unknown, ResetPasswordUserInput["body"]>,
	res: Response,
) {
	// 1. check that the reset token and email address pair exist in the reset password table and are still valid
	// 2. get the user document
	// 3. generate a new password hash
	// 4. update the document and return the new user

	const tokenValidity = await UserService.checkResetToken({
		body: {
			email: req.body.email,
			token: req.body.token,
		},
	});
	if (tokenValidity !== CheckResetTokenEnum.TokenValid) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.json(error("Invalid token", res.statusCode));
	}

	const userDocument = await UserService.getUserByEmail(req.body);
	if (!userDocument) {
		return res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.json(error("User does not exist!", res.statusCode));
	}

	const newUserDocument = await UserService.resetPassword(req);
	if (newUserDocument) {
		return res.send(
			success<UserDocument>(newUserDocument, {
				statusCode: res.statusCode,
			}),
		);
	}

	return res
		.status(StatusCodes.FORBIDDEN)
		.send(
			error("Error: could not reset the password for the user", res.statusCode),
		);
}
