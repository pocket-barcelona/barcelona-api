import type {
  SessionDocument,
  SessionExpiry,
  SessionTokenModel,
} from "../../models/auth/session.model";
import type { UserDocument } from "../../models/auth/user.model";
import {
  createOrUpdateSessionHandler,
  findSessionHandler,
  getSessionExpiryDataHandler,
  getSessionHandler,
  logoutSessionHandler,
  reIssueAccessTokenHandler,
  type ReissueAccessTokenErrorEnum,
} from "./functions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SessionService {
  static createOrUpdateSession = async (
    user: UserDocument,
    userAgent: string
  ): Promise<SessionDocument | null> =>
    createOrUpdateSessionHandler(user, userAgent);

  static findSession = async (
    session: Pick<SessionDocument, "user" | "valid">
  ): Promise<SessionDocument | null> => findSessionHandler(session);

  static getSessionExpiryData = (type: "access" | "refresh"): SessionExpiry =>
    getSessionExpiryDataHandler(type);

  static getSession = (user: UserDocument): Promise<SessionDocument | false> =>
    getSessionHandler(user);

  static logoutSession = async (
    existingSessionData: Pick<SessionDocument, "user">
  ): Promise<SessionDocument | null> =>
    logoutSessionHandler(existingSessionData);

  static reIssueAccessToken = async ({
    refreshToken,
  }: Pick<SessionTokenModel, "refreshToken">): Promise<
    string | ReissueAccessTokenErrorEnum
  > => reIssueAccessTokenHandler({ refreshToken });
}
