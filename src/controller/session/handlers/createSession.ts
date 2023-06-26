import { Request, Response } from "express";
import { SessionService } from "../../../service/session/session.service";
import { SessionUtils } from "../../../utils/jwt.utils";
import { UserService } from "../../../service/user/user.service";
import { SessionTokenModel } from "../../../models/auth/session.model";
import { error, success } from "../../../middleware/apiResponse";
import { SessionInput } from "../../../schema/session/session.schema";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes

/**
 * Login the user. Check the POSTed email and password
 * @param req
 * @param res
 * @returns
 */
export default async function createSession(
  req: Request<{}, {}, SessionInput["body"]>,
  res: Response
) {
  // Validate the user's password
  const user = await UserService.validatePassword(req.body);

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(error("Invalid email or password", res.statusCode));
  }

  // logger.info('Attempting to create a user session token')

  // create a session
  const session = await SessionService.createOrUpdateSession(
    user,
    req.get("user-agent") || ""
  );

  if (!session) {
    // logger.warn({
    //   'could_not_create_session_for': user
    // })
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error("Error creating session!", res.statusCode));
  }

  const sessionExpiryAccessToken =
    SessionService.getSessionExpiryData("access");
  const sessionExpiryRefreshToken =
    SessionService.getSessionExpiryData("refresh");

  // build token data - decoded on FE
  const accessTokenData = {
    ...user,
    ...sessionExpiryAccessToken,
    session: session,
  };
  // @todo - do we really need to put the user in the refresh token?
  const refreshTokenData = {
    ...user,
    ...sessionExpiryRefreshToken,
    session: session,
  };

  // create a signed access token
  const accessToken = SessionUtils.signJwt(
    accessTokenData,
    "accessTokenPrivateKey"
    // { expiresIn: `${config.accessTokenTtl}m` } // e.g. "30m" (30 minutes)
  );

  // create a signed refresh token
  const refreshToken = SessionUtils.signJwt(
    refreshTokenData,
    "refreshTokenPrivateKey"
    // { expiresIn: `${config.refreshTokenTtl}m` } // e.g. 1 year
  );

  if (!accessToken || !refreshToken) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        error(
          "Error creating session tokens, please try again later.",
          res.statusCode
        )
      );
  }

  // return access & refresh tokens
  return res.send(
    success<SessionTokenModel>(
      {
        accessToken,
        refreshToken,
      },
      {
        statusCode: res.statusCode,
      }
    )
  );
}
