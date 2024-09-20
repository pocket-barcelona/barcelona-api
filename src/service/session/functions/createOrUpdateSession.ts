import SessionModel, { type SessionDocument } from "../../../models/auth/session.model";
import type { UserDocument } from "../../../models/auth/user.model";
import getExistingSession from "./getSession";

/**
 * Create a new user session in the DB and return it
 * @param user The user
 * @param userAgent
 * @returns
 */
export default async function createOrUpdateSession(
  user: UserDocument,
  userAgent: string
): Promise<SessionDocument | null> {
  // logger.info(`Creating session in DB for user ID: ${user.email} with agent ${userAgent}`);

  let session: SessionDocument | null = null;

  // @todo - use .update since it is going to upsert the document!
  const existingSession = await getExistingSession(user);

  if (existingSession) {
    // update existing document

    try {
      session = await SessionModel.update({
        user: user.email,
        userAgent,
        valid: true, // @todo - ??? set to true because: false = logged out
      });
    } catch (error) {
      // logger.warn(error);
      // throw new Error();
      // return null
    }
  } else {
    try {
      session = await SessionModel.create({
        user: user.email,
        userAgent,
        valid: true,
      });
    } catch (error) {
      // logger.warn(error);
      // throw new Error();
      // return null
    }
  }

  // return session.toJSON();
  return session;
}
