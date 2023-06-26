import { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { UserDocument } from "../../../models/auth/user.model";
import { ForgotPasswordUserInput } from "../../../schema/user/forgot-password.schema";

export default async function forgotPassword(
  req: Request<{}, {}, ForgotPasswordUserInput["body"]>,
  res: Response
) {
  // check if user exists
  let userDocument: UserDocument | null = null;
  try {
    userDocument = await UserService.getUserByEmail(req.body);
  } catch (e: any) {
    // logger.error(e);
  }
  if (!userDocument) {
    return res.status(StatusCodes.NOT_FOUND).json(
      error(
        "The user does not exist or the account is invalid", // or some other error
        res.statusCode
      )
    );
  }

  // generate a reset token and put it in the database
  // send the token to the user in a special link, in an email
  const resetDocument = await UserService.generatePasswordResetToken(req.body);
  if (!resetDocument) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        error("There was an error, please try again later", res.statusCode)
      );
  }

  // attempt to send a reset email to the user
  const hasSentEmail = await UserService.forgotPassword(
    resetDocument,
    userDocument
  );
  if (hasSentEmail !== 1) {
    // return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        error(
          "There was an error sending the reset email, please try again",
          res.statusCode,
          hasSentEmail.toString()
        )
      );
  }

  return res.send(
    success<boolean>(true, {
      statusCode: res.statusCode,
      message: "A reset password email has been sent to the user",
    })
  );
}
