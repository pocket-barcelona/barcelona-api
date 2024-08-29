import type { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { config } from "../config";
import { SessionUtils } from "../utils/jwt.utils";
// import { SessionService } from "../service/session/session.service";
import lodash from 'lodash';
const { get } = lodash;

/** Curry middleware function - check that the user is logged in */
const requireRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  
  // const accessToken = get(req, `headers.${config.HEADER_AUTHORIZATION.toLowerCase()}`, "").replace(
  //   /^Bearer\s/,
  //   ""
  // ) as string;

  // if (!accessToken) {
  //   return next();
  // }
  
  // const { decoded, expired } = SessionUtils.verifyJwt(accessToken, "accessTokenPublicKey");

  // const refreshToken = get(
  //   req,
  //   `headers.${config.HEADER_X_REFRESH_TOKEN.toLowerCase()}`,
  //   ""
  // ) as string; // in the front end or Postman, can be like: X-Refresh: {{refreshToken}}

  // // re-issue expired token, if a refresh token is available in the request
  // // https://youtu.be/BWUi6BS9T5Y?t=6050
  // if (expired && refreshToken) {
  //   // logger.info('Expired token, but refresh token given')
  //   const newAccessToken = await SessionService.reIssueAccessToken({
  //     refreshToken,
  //   });

  //   if (typeof newAccessToken !== "string") {
  //     return res
  //       .status(StatusCodes.FORBIDDEN)
  //       .send(error("Refresh token expired", res.statusCode));
  //     // res.statusCode = 403;
  //     // return next()
  //   }

  //   // issue a header for the front end interceptors, so that they can update their access token with this new one
  //   res.setHeader(config.HEADER_X_ACCESS_TOKEN, newAccessToken);

  //   const result = SessionUtils.verifyJwt(
  //     newAccessToken as string,
  //     "accessTokenPublicKey"
  //   );

  //   // add the user session to local request data for Express
  //   // http://expressjs.com/en/api.html#res.locals
  //   if (result.decoded) {
  //     res.locals.user = result.decoded;
  //   }

  //   return next();
  // }
  return next();
};

export default requireRefreshToken;
