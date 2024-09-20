import type { Request, Response } from "express";
import { config } from "../../../config";
import { SessionService } from "../../../service/session/session.service";
import { SessionUtils } from "../../../utils/jwt.utils";
import { UserService } from "../../../service/user/user.service";
import logger from "../../../utils/logger";
import { SessionDocument, SessionTokenModel } from "../../../models/auth/session.model";
import { error, success } from "../../../middleware/apiResponse";
import { SessionInput } from "../../../schema/session/session.schema";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import lodash from "lodash";
const { get } = lodash;

/**
   * re-issue expired token, if a refresh token is available in the request
   * @url Inspired by: https://youtu.be/BWUi6BS9T5Y?t=6050
   * @param  {Request} req
   * @param  {Response} res
   */
 export default async function refreshSession(req: Request, res: Response) {
  const accessToken = get(req, `headers.${config.HEADER_AUTHORIZATION.toLowerCase()}`, "").toString().replace(
    /^Bearer\s/,
    ""
  ) as string;

  if (!accessToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Invalid or no access token supplied", res.statusCode));
  }
  
  const { decoded, expired, valid } = SessionUtils.verifyJwt(accessToken, "accessTokenPublicKey");

  if (!valid) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(error("Invalid access token", res.statusCode));
  }

  const refreshToken = get(
    req,
    `headers.${config.HEADER_X_REFRESH_TOKEN.toLowerCase()}`,
    ""
  ) as string; // in the front end or Postman, can be like: X-Refresh: {{refreshToken}}

  if (!refreshToken) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Invalid or no refresh token supplied", res.statusCode));
  }

  const { expired: expiredRefresh, valid: validRefresh } = SessionUtils.verifyJwt(refreshToken, "refreshTokenPublicKey");

  if (!validRefresh) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(error("Invalid access token", res.statusCode));
  }
  if (expiredRefresh) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(error("Refresh token has expired, please sign in", res.statusCode));
  }

  // if the access token is given & valid, and the refresh token is supplied
  const newAccessToken = await SessionService.reIssueAccessToken({
    refreshToken,
  });

  if (typeof newAccessToken !== "string") {
    return res
      .status(StatusCodes.FORBIDDEN)
      .send(error("Refresh token expired or invalid, please sign in", res.statusCode));
  }

  
  // const result = SessionUtils.verifyJwt(
  //   newAccessToken as string,
  //   "accessTokenPublicKey"
  //   );

  // issue a header for the front end interceptors, so that they can update their access token with this new one
  res.setHeader(config.HEADER_X_ACCESS_TOKEN, newAccessToken);

  // add the user session to local request data for Express
  // http://expressjs.com/en/api.html#res.locals
  
  // this will be done with the deserializeUser on the next call
  // if (result.decoded) {
  //   res.locals.user = result.decoded;
  // }

  // return newAccessToken;

  // return 200 with the refresh header set - frontend will retrieve the new access token from there
  // return res
  // .sendStatus(StatusCodes.OK);

  return res.send(
    success<
      string
    >('Refreshed', {
      statusCode: res.statusCode,
    })
  );
  
}