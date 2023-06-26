import SessionModel, { SessionDocument } from "../../../models/auth/session.model";

/**
 * Find a valid user session record in the database
 * @param session
 * @returns
 */
export default async function findSession(
  session: Pick<SessionDocument, "user" | "valid">
): Promise<SessionDocument | null> {
  /**
   * @link https://dynamoosejs.com/guide/Model#modelgetkey-settings
   */
  let sessionDocument: SessionDocument;
  try {
    sessionDocument = await SessionModel.get({
      user: session.user.toString(),
      valid: session.valid ? 1 : 0, // @todo - check this!
    });
    return sessionDocument || null;
  } catch (error) {}
  return null;
}
