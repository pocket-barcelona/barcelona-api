import UserModel, { type UserDocument } from "../../../models/auth/user.model";
import type { ResetPasswordUserInput } from "../../../schema/user/reset-password.schema";
import lodash from "lodash";
const { omit } = lodash;

export default async function resetPassword(input: ResetPasswordUserInput): Promise<UserDocument | false> {
  const { password, email } = input.body;
  if (!password || !email) return false;

  // const newPasswordHash = await generateHashedPassword(password)
  
  try {
    
    // const newUser = await NewPasswordModel.update({
    //   'email': input.body.email,
    //   'password': input.body.password
    // })

    const newUser = await UserModel.update({
      'email': email.toString(),
      'password': password.toString(),
    })
    return omit(newUser.toJSON(), 'password') as UserDocument;

  } catch (error) {
    // logger.warn(error)
    return false
  }
}