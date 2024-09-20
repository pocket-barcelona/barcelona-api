import type { Request, Response } from "express";
import { UserService } from "../../../service/user/user.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { ConfirmEmailAddressUserInput } from "../../../schema/user/confirm-email-address";


export default async function confirmEmailAddress(
  req: Request<unknown, unknown, ConfirmEmailAddressUserInput["body"]>,
  res: Response
) {
  let confirmed = false;

  try {
    confirmed = await UserService.confirmEmailAddress(req);
  } catch (error) {
    if (error instanceof Error) {
      // logger.warn(error.message);
    }
  }

  if (confirmed) {
    return res.send(
      success<boolean>(true, {
        statusCode: res.statusCode,
        message: "Confirmed",
      })
    );
  }

  return res
    .status(StatusCodes.FORBIDDEN)
    .json(
      error(
        "The email address could not be confirmed.",
        res.statusCode
      )
    );
}
