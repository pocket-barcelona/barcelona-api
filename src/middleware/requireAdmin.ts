import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../models/auth/user.model";
import { error } from "./apiResponse";

/** Curry middleware function - check that the user is logged in */
const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user as UserDocument;

	if (!user) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.send(error("Please log in", res.statusCode));
	}

	// if (user.role !== UserRoleEnum.Admin) {
	//   return res.status(StatusCodes.UNAUTHORIZED).send(
	//     error(
	//       'You are not authorized to perform this action',
	//       res.statusCode,
	//     )
	//   );
	// }

	return next();
};

export default requireAdmin;
