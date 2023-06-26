import UserModel, { UserDocument } from "../../../models/auth/user.model";

/**
 * Get a user by email AND userId
 * @param  {typeof UserModel['email']} email
 * @param  {typeof UserModel['userId']} userId
 * @returns Promise
 */
export default async function getUserByIdAndEmail(
  email: typeof UserModel["email"],
  userId: typeof UserModel["userId"]
): Promise<UserDocument | null> {
  // UserModel.query('email').eq(query.email) // example on here: https://github.com/dynamoose/dynamoose/issues/35

  let userFound = null;

  try {
    // example on here: https://github.com/dynamoose/dynamoose/issues/35
    userFound = await UserModel.query("email")
      .eq(email.toString())
      .where("userId")
      .eq(userId.toString())
      .limit(1)
      .exec()
      .catch((err: any) => {
        // logger.warn(err)
        return null;
      });

    if (!userFound || !userFound[0]) return null;

    return userFound[0];
  } catch (error) {
    // logger.warn(error)
    return null;
  }
}
