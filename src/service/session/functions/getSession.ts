import SessionModel, { type SessionDocument } from "../../../models/auth/session.model";
import type { UserDocument } from "../../../models/auth/user.model";

/**
 * Find an existing session document in the DB. If exists, check if it is valid
 * @param  {UserDocument} user
 * @returns Promise
 */
export default async function getSession(
  user: UserDocument
): Promise<SessionDocument | false> {
  let hasSession: SessionDocument;
  try {
    hasSession = await SessionModel.get({
      user: user.email,
      // valid: true
    });

    return hasSession || false;
  } catch (_error) {
    // logger.warn(error);
    // throw new Error();
    return false;
  }
}
