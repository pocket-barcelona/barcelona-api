import type { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { UserDocument } from "../../../models/auth/user.model";
import type {
  ReadUserInput,
  UpdateUserInput,
} from "../../../schema/user/user.schema";

export default async function updateUser(
  // @todo - fix
  req: Request<ReadUserInput["params"] | any, {}, UpdateUserInput["body"]>,
  res: Response
) {
  // check if user already exists
  // const userExists = await UserService.getUserByEmail({
  //   email: req.body.userId
  // });
  const userExists = await UserService.getUserByIdAndEmail(
    req.body.email,
    req.params.userId
  );

  if (userExists === null) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(error("Error: User not found", res.statusCode));
  }
  // else if (typeof userExists === 'string') {
  //   return res.status(StatusCodes.BAD_REQUEST).json(
  //     error(
  //       userExists,
  //       res.statusCode
  //     )
  //   )
  // }

  const updatedUser = await UserService.updateUser(req);
  if (!updatedUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(error("Error, the user was not updated", res.statusCode));
  }

  return res.send(
    success<UserDocument>(updatedUser as UserDocument, {
      statusCode: res.statusCode,
      message: "User updated",
    })
  );

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
  //   error(
  //     'Error, the user was not updated',
  //     res.statusCode
  //   )
  // )
}
