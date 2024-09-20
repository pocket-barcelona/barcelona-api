import type { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { UserDocument } from "../../../models/auth/user.model";

export default async function getLoggedInUser(req: Request, res: Response) {
  const email = res.locals.user.email as string;
  // return user by email

  // get user
  let user = null;
  try {
    user = await UserService.getUserByEmail({
      email,
    });
  } catch (e: unknown) {
    // logger.error(e);
  }

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      error(
        "The user does not exist or the account is invalid", // or some other error
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
