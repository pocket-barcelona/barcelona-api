import type { NextFunction, Request, Response } from 'express';
// import { StatusCodes } from "http-status-codes";
import lodash from 'lodash';
import { config } from '../config.js';
// import { SessionService } from "../service/session/session.service.js";
import { SessionUtils } from '../utils/jwt.utils.js';

// import logger from "../utils/logger.js";
// import { error } from "./apiResponse.js";

const { get } = lodash;

/**
 * Attempt to deserialise the user info from the access token
 * The user data is only considered valid if:
 * 1. The access token is valid and not expired, or;
 * 2. The access token has expired, but the refresh token is valid
 * Note: This middleware is called on EVERY request
 */
const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const accessToken = get(req, `headers.${config.HEADER_AUTHORIZATION.toLowerCase()}`, '')
		.toString()
		.replace(/^Bearer\s/, '') as string;

	if (!accessToken) {
		return next();
	}

	const { decoded, expired } = await SessionUtils.verifyJwt(accessToken, 'accessTokenPublicKey');

	if (decoded && !expired) {
		// session token valid and not expired yet
		// http://expressjs.com/en/api.html#res.locals

		// add the user session to local request data for Express
		res.locals.user = decoded;
		// do next request
		return next();
	}

	// ###################################
	// this is now in the refresh endpoint

	// const refreshToken = get(req, `headers.${config.HEADER_X_REFRESH_TOKEN.toLowerCase()}`, '') as string; // in the front end or Postman, can be like: X-Refresh: {{refreshToken}}

	// // re-issue expired token, if a refresh token is available in the request
	// // https://youtu.be/BWUi6BS9T5Y?t=6050
	// if (expired && refreshToken) {

	//   // logger.info('Expired token, but refresh token given')
	//   const newAccessToken = await SessionService.reIssueAccessToken({ refreshToken });

	//   if (typeof newAccessToken !== 'string') {
	//     return res.status(StatusCodes.FORBIDDEN).send(
	//       error(
	//         'Refresh token expired',
	//         res.statusCode,
	//       )
	//     )
	//     // res.statusCode = 403;
	//     // return next()
	//   };

	//   // issue a header for the front end interceptors, so that they can update their access token with this new one
	//   res.setHeader(config.HEADER_X_ACCESS_TOKEN, newAccessToken);

	//   const result = SessionUtils.verifyJwt(newAccessToken as string, "accessTokenPublicKey");

	//   // add the user session to local request data for Express
	//   // http://expressjs.com/en/api.html#res.locals
	//   if (result.decoded) {
	//     res.locals.user = result.decoded;
	//   }

	//   return next();
	// }

	return next();
};

export default deserializeUser;
