import { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";

export default async function getList(req: Request, res: Response) {
  const users = await UserService.getUsers();

  if (!users) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Error getting users list", res.statusCode));
  }

  return res.send(success(users));
}
