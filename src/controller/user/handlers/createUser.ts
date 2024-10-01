import type { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { CreateUserInput } from "../../../schema/user/user.schema";
import type { UserDocument } from "../../../models/auth/user.model";

/** Signup */
export default async function createUser(
  req: Request<unknown, unknown, CreateUserInput["body"]>,
  res: Response
) {
  // check if user already exists
  const userExists = await UserService.getUserByEmail(req.body);

  if (userExists) {
    return res.status(StatusCodes.FORBIDDEN).json(
      error(
        "The user already exists or the account is invalid", // or some other error...
        res.statusCode
      )
    );
  }

  const newUser = await UserService.createUser(req.body);

  if (!newUser) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error("Error, the user was not created", res.statusCode));
  }
  if (typeof newUser === "string") {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error(newUser, res.statusCode));
  }

  // send the user a welcome email...
  // @requires send grid
  // const sentEmail = await UserService.sendWelcomeEmail(newUser);
  // ignore success of sending the email - could fail in theory

  return res.send(
    success<Partial<UserDocument>>(newUser, {
      statusCode: res.statusCode,
    })
  );
}
