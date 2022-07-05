import { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import {
	StatusCodes,
} from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes

/** Curry middleware function - check that the user is logged in */
const requireUser = (req: Request, res: Response, next: NextFunction) => {
  
  const user = res.locals.user;

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).send(
      error(
        'Please log in',
        res.statusCode,
      )
    );
  }

  return next();
};

export default requireUser;
