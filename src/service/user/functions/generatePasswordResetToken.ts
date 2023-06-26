import ResetPasswordModel, { ResetPasswordDocument } from "../../../models/auth/reset-password.model";
import { UserDocument } from "../../../models/auth/user.model";
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate and return a new password reset document
 * @param user
 * @returns
 */
export default async function generatePasswordResetToken(
  user: Pick<UserDocument, "email">
): Promise<ResetPasswordDocument | null> {
  const resetToken = uuidv4();

  let resetDocument: ResetPasswordDocument | null = null;
  try {
    // calling update will create OR update, depending on if the document exists or not!
    const resetDocument = await ResetPasswordModel.update({
      email: user.email.toString(),
      resetToken: resetToken,
      resetTimestamp: new Date().getTime(),
    });

    // return processed.unprocessedItems.length === 0 ? processed

    return resetDocument;
  } catch (error) {
    // logger.warn({ "Problem creating reset token for": user.email });
  }
  return resetDocument;
}
