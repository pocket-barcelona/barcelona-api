import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import { CheckResetTokenEnum } from "../../../models/auth/user.model";
import type { CheckResetTokenUserInput } from "../../../schema/user/check-reset-token.schema";
import { UserService } from "../../../service/user/user.service";

export default async function checkResetToken(
	req: Request<unknown, unknown, CheckResetTokenUserInput["body"]>,
	res: Response,
) {
	const tokenValidity = await UserService.checkResetToken(req);

	switch (tokenValidity) {
		case CheckResetTokenEnum.TokenValid: {
			return res.send(
				success<boolean>(true, {
					statusCode: res.statusCode,
					message: "Token valid",
				}),
			);
		}

		case CheckResetTokenEnum.NoDocument: {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json(
					error(
						"Email or token invalid. Please reset your password again",
						res.statusCode,
					),
				);
		}

		case CheckResetTokenEnum.TokenExpired: {
			// @todo - could remove this since it technically exposes if a user exists in the DB, if they have reset their password before!!
			return res
				.status(StatusCodes.NOT_FOUND)
				.json(error("Token expired", res.statusCode));
		}

		default: {
			return res
				.status(StatusCodes.NOT_FOUND)
				.json(error("Invalid token", res.statusCode));
		}
	}
}
