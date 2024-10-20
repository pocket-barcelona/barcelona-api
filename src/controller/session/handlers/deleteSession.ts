import type { Request, Response } from "express";
import { SessionService } from "../../../service/session/session.service";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes

export default async function deleteSession(
  req: Request,
  res: Response
) {
  const sessionId = res.locals.user ? res.locals.user.session : null;
  if (!sessionId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json(error("User is not logged in", res.statusCode));
  }

  // log out the user by setting their session to valid=false
  const loggedOut = await SessionService.logoutSession({
    user: sessionId.user,
  });
  if (loggedOut) {
    return res.send(
      success<any>(
        {
          accessToken: null,
          refreshToken: null,
        },
        {
          statusCode: res.statusCode,
        }
      )
    );
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(error("Error logging out", res.statusCode));
}
