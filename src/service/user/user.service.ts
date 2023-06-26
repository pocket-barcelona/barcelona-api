import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import UserModel, {
  CheckResetTokenEnum,
  UserDocument,
  UserInput,
} from "../../models/auth/user.model";
import { CheckResetTokenUserInput } from "../../schema/user/check-reset-token.schema";
import { ResetPasswordUserInput } from "../../schema/user/reset-password.schema";
import { ResetPasswordDocument } from "../../models/auth/reset-password.model";
import { SessionInput } from "../../schema/session/session.schema";
import { UpdateUserInput } from "../../schema/user/user.schema";
import {
  checkResetTokenHandler,
  createUserHandler,
  forgotPasswordHandler,
  generatePasswordResetTokenHandler,
  getUserByEmailHandler,
  getUserByIdAndEmailHandler,
  getUsersHandler,
  resetPasswordHandler,
  sendWelcomeEmailHandler,
  updateUserHandler,
  validatePasswordHandler,
  confirmEmailAddressHandler,
} from "./functions";
import { ConfirmEmailAddressUserInput } from "../../schema/user/confirm-email-address";

export class UserService {
  static checkResetToken = (
    user: CheckResetTokenUserInput
  ): Promise<CheckResetTokenEnum> => checkResetTokenHandler(user);

  static confirmEmailAddress = (
    input: ConfirmEmailAddressUserInput
  ): Promise<boolean> => confirmEmailAddressHandler(input);

  static createUser = async (
    input: UserInput
  ): Promise<UserDocument | null | string> => createUserHandler(input);

  static forgotPassword = (
    document: ResetPasswordDocument,
    user: UserDocument
  ): Promise<number> => forgotPasswordHandler(document, user);

  static generatePasswordResetToken = (
    user: Pick<UserDocument, "email">
  ): Promise<ResetPasswordDocument | null> =>
    generatePasswordResetTokenHandler(user);

  static getUserByIdAndEmail = (
    email: typeof UserModel["email"],
    userId: typeof UserModel["userId"]
  ): Promise<UserDocument | null> => getUserByIdAndEmailHandler(email, userId);

  static getUserByEmail = (
    user: Pick<UserDocument, "email">,
    revealPasswordHash: boolean = false
  ): Promise<UserDocument | null> =>
    getUserByEmailHandler(user, revealPasswordHash);

  static getUsers = async (): Promise<ScanResponse<UserDocument> | null> =>
    getUsersHandler();

  static resetPassword = (
    input: ResetPasswordUserInput
  ): Promise<UserDocument | false> => resetPasswordHandler(input);

  static sendWelcomeEmail = (user: UserDocument): Promise<boolean> =>
    sendWelcomeEmailHandler(user);

  static updateUser = (input: UpdateUserInput): Promise<UserDocument | false> =>
    updateUserHandler(input);

  static validatePassword = (
    reqBody: SessionInput["body"]
  ): Promise<UserDocument | null> => validatePasswordHandler(reqBody);
}
