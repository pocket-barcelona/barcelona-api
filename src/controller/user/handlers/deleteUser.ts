import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import { UserStatusEnum } from "../../../models/auth/user.model";
import type { DeleteUserInput } from "../../../schema/user/user.schema";
import { UserService } from "../../../service/user/user.service";

export default async function deleteUser(
	req: Request<DeleteUserInput["params"], unknown, DeleteUserInput["body"]>,
	res: Response,
) {
	// performHardDelete: boolean = false,
	// if (performHardDelete) {
	//   // check if user is allowed to do this!
	//   // res.locals.user
	// }

	// make sure user has permission to delete account

	// check if the event exists
	const userId = req.params.userId;
	const email = req.body.email;
	if (!userId || !email) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(error("Bad request", res.statusCode));
	}

	const theUser = await UserService.getUserByIdAndEmail(email, userId);

	if (!theUser) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("User not found", res.statusCode));
	}

	// support soft deleted users
	if (theUser.userStatus === UserStatusEnum.Deleted) {
		return res
			.status(StatusCodes.FORBIDDEN)
			.send(error("User does not exist", res.statusCode));
	}

	let deleted = false;
	try {
		deleted = await theUser
			.delete()
			.catch((_err) => {
				// logger.warn(err)
				return false;
			})
			.then(() => {
				return true;
			});
	} catch (_err) {
		// logger.warn(err)
	}

	if (deleted) {
		return res.send(
			success<boolean>(true, {
				statusCode: res.statusCode,
			}),
		);
	}

	return res
		.status(StatusCodes.INTERNAL_SERVER_ERROR)
		.send(error("User not deleted due to an error", res.statusCode));
}
