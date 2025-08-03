import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import { UserService } from "../../../service/user/user.service";

export default async function getList(_req: Request, res: Response) {
	const users = await UserService.getUsers();

	if (!users) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(error("Error getting users list", res.statusCode));
	}

	return res.send(success(users));
}
