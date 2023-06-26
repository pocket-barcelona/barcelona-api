import { Request, Response } from "express";
import { CheckResetTokenUserInput } from "../../schema/user/check-reset-token.schema";
import { ForgotPasswordUserInput } from "../../schema/user/forgot-password.schema";
import {
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
  ReadUserInput,
} from "../../schema/user/user.schema";
import { ResetPasswordUserInput } from "../../schema/user/reset-password.schema";
import { ConfirmEmailAddressUserInput } from "../../schema/user/confirm-email-address";
import {
  checkResetToken,
  confirmEmailAddress,
  createUser,
  deleteUser,
  forgotPassword,
  getList,
  getLoggedInUser,
  resetPassword,
  updateUser,
} from "./handlers";

export class UserController {
  // static getListHandler = (req: Request, res: Response) =>

  static checkResetTokenHandler = (
    req: Request<{}, {}, CheckResetTokenUserInput["body"]>,
    res: Response
  ) => checkResetToken(req, res);

  static confirmEmailAddressHandler = (
    req: Request<{}, {}, ConfirmEmailAddressUserInput["body"]>,
    res: Response
  ) => confirmEmailAddress(req, res);

  /** Signup */
  static createUserHandler = (
    req: Request<{}, {}, CreateUserInput["body"]>,
    res: Response
  ) => createUser(req, res);

  static deleteUserHandler = (
    req: Request<DeleteUserInput["params"], {}, DeleteUserInput["body"]>,
    res: Response
  ) => deleteUser(req, res);

  static forgotPasswordHandler = (
    req: Request<{}, {}, ForgotPasswordUserInput["body"]>,
    res: Response
  ) => forgotPassword(req, res);

  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getLoggedInUserHandler = (req: Request, res: Response) =>
    getLoggedInUser(req, res);

  static resetPasswordHandler = (
    req: Request<{}, {}, ResetPasswordUserInput["body"]>,
    res: Response
  ) => resetPassword(req, res);

  static updateUserHandler = (
    req: Request<ReadUserInput["params"] | any, {}, UpdateUserInput["body"]>,
    res: Response
  ) => updateUser(req, res);
}
