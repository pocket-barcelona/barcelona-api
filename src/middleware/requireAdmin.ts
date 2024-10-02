import type { Request, Response, NextFunction } from "express";
import { error } from "./apiResponse";
import {
	StatusCodes,
} from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import { UserRoleEnum, type UserDocument } from '../models/auth/user.model';

/** Curry middleware function - check that the user is logged in */
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  
  const user = (res.locals.user as UserDocument);

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).send(
      error(
        'Please log in',
        res.statusCode,
      )
    );
  }

  if (user.role !== UserRoleEnum.Admin) {
    return res.status(StatusCodes.UNAUTHORIZED).send(
      error(
        'You are not authorized to perform this action',
        res.statusCode,
      )
    );
  }

  return next();
};

export default requireAdmin;
