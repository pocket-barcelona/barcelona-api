import UserModel, { UserDocument } from "../../../models/auth/user.model";
import lodash from "lodash";
const { omit } = lodash;

/**
 * Check if a user exists in the database, matching the given email
 * @param user
 * @param revealPasswordHash If true, the password hash string will be included in the returned document
 * @returns
 */
export default async function getUserByEmail(
  user: Pick<UserDocument, "email">,
  revealPasswordHash: boolean = false
): Promise<UserDocument | null> {
  // example on here: https://github.com/dynamoose/dynamoose/issues/35
  try {
    // const userFound = await UserModel
    // .query('email')
    // .eq(user.email.toString())
    // .exec();
    // return userFound.count > 0
    const userFound = await UserModel.get({
      email: user.email,
    }).catch((err) => {
      // logger.warn(err)
      return null;
    });

    if (!userFound) return null;

    if (revealPasswordHash) {
      return userFound;
    } else {
      return omit(userFound, "password") as UserDocument;
    }
    // return user as UserDocument;
  } catch (error) {
    // logger.info({'User not found': error})
  }
  return null;
}
