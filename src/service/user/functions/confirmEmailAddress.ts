import UserModel, { UserEmailConfirmedEnum, UserStatusEnum } from "../../../models/auth/user.model";
import type { ConfirmEmail } from "../../../models/auth/confirm-email.model";
import { EmailUtils } from "../../email/email.utils";
import type { ConfirmEmailAddressUserInput } from "../../../schema/user/confirm-email-address";

/**
 * Handle confirm email address action
 * 1. make sure signature was signed by this server
 * 2. get user document
 * 3. if user is confirmed, return true
 * 4. else, set emailConfirmed to true
 * 
 * Scenarios. Already confirmed, cannot confirm (user is not allowed or not active), user does not exist, bad code, other error
 * @param  {ConfirmEmailAddressUserInput} input
 * @returns Promise<boolean>
 */
export default async function confirmEmailAddress(input: ConfirmEmailAddressUserInput): Promise<boolean> {
  
  const emailDataObject: ConfirmEmail = {
    email: input.body.email,
  };

  // check signature token to make sure it was signed by this server...

  // decode posted token back to the original signature
  const decodedSignature = Buffer.from(
    input.body.token,
    'base64'
  ).toString("ascii");
  
  const stringified = JSON.stringify(emailDataObject);
  const matches = await EmailUtils.compareSignature(decodedSignature, stringified);

  if (!matches) {
    // bad token, do not confirm user account
    return Promise.resolve(false);
  }
  
  try {
    
    const user = await UserModel.get(input.body.email);

    if (user.emailConfirmed === UserEmailConfirmedEnum.Unconfirmed) {

      // make sure user is enabled
      if (user.userStatus !== UserStatusEnum.Active) {
        // throw new Error('User is not enabled. Cannot update user document');
        return Promise.resolve(false);
      }
      
      // update record and save document
      user.emailConfirmed = UserEmailConfirmedEnum.Confirmed;
      const updatedUser = await user.save();

      if (updatedUser) {
        // confirmed, success
        return Promise.resolve(true);
      }
      // throw new Error('Error saving user document');
      return Promise.resolve(false);
      
    }
  } catch (e) {
    // if (e instanceof Error) {
    //   return Promise.resolve(false);
    // } else {
    //   return Promise.resolve(false);
    //   // return Promise.reject("An error occurred when trying to notify the user");
    // }
  }
  
  return Promise.resolve(false);
  
}