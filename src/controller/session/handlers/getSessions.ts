import { Request, Response } from "express";
import { SessionService } from "../../../service/session/session.service";
import logger from "../../../utils/logger";
import { SessionDocument } from "../../../models/auth/session.model";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes

export default async function getSessions(req: Request, res: Response) {
  const userId = res.locals.user ? res.locals.user.email : null;
  if (!userId) {
    // logger.warn("User not in local session!");
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(
        error("User ID not found in current request session!", res.statusCode)
      );
  }

  // check DB to see if user has a valid session
  const sessions = await SessionService.findSession({
    user: userId,
    valid: true,
  });

  if (sessions) {
    // check expiration
    if (sessions.valid === false) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(error("Session expired, please login", res.statusCode));
    }

    // return session record from DB
    return res.send(
      success<Pick<SessionDocument, "userAgent" | "user" | "valid">>(sessions, {
        statusCode: res.statusCode,
      })
    );
  }

  return res
    .status(StatusCodes.NOT_FOUND)
    .json(error("No sessions found", res.statusCode));
}
