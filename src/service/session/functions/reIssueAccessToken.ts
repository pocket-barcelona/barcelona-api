import SessionModel, { type SessionDocument, type SessionTokenModel } from "../../../models/auth/session.model";
import { UserStatusEnum } from "../../../models/auth/user.model";
import { SessionUtils } from "../../../utils/jwt.utils";
import { UserService } from "../../user/user.service";
import { SessionService } from "../session.service";
import lodash from 'lodash';

const { get } = lodash;

export enum ReissueAccessTokenErrorEnum {
  InvalidRefreshToken = 1,
  ExpiredRefreshToken = 2,
  MalformedRefreshToken = 3,
  NotSignedIn = 4,
  AuthServerError = 5,
  UserDoesNotExist = 6,
  UserAccountDisabled = 7,
}

/**
   * For a valid refresh token
   * @url https://youtu.be/BWUi6BS9T5Y?t=5546
   * @param SessionTokenModel.refreshToken
   * @returns Promise
   */
 export default async function reIssueAccessToken({ refreshToken }: Pick<SessionTokenModel, 'refreshToken'>): Promise<string | ReissueAccessTokenErrorEnum> {
    
  // decode token
  const { decoded, valid, expired } = SessionUtils.verifyJwt(refreshToken, "refreshTokenPublicKey");
  
  // refresh token is not valid or has expired
  if (valid === false) return ReissueAccessTokenErrorEnum.InvalidRefreshToken;
  if (expired) return ReissueAccessTokenErrorEnum.ExpiredRefreshToken;
  
  // @todo should be a string not undefined? https://www.geeksforgeeks.org/lodash-_-get-method/
  const sessionValue = get(decoded, "session") as unknown as string;

  if (!decoded || !sessionValue) return ReissueAccessTokenErrorEnum.MalformedRefreshToken; // invalid refresh token object - model could have changed!
  
  let session: SessionDocument;
  try {
    
    // the token can only be re-issued if there is a session document which is valid
    // a session doc is created (or updated) when the user logs in
    session = await SessionModel.get(sessionValue);
    // could not find session in the DB
    if (!session) return ReissueAccessTokenErrorEnum.NotSignedIn;
    // session exists, but is not valid - user has logged out
    if (session.valid === false) return ReissueAccessTokenErrorEnum.NotSignedIn;

  } catch (error) {
    // generic error calling DB
    return ReissueAccessTokenErrorEnum.AuthServerError;
  }

  try {
    
    const user = await UserService.getUserByEmail({
      'email': session.user
    });
  
    // user has since been removed from system
    if (!user) return ReissueAccessTokenErrorEnum.UserDoesNotExist;

    // user is no longer active
    if (user.userStatus !== UserStatusEnum.Active) return ReissueAccessTokenErrorEnum.UserAccountDisabled;

    // build new expiry object
    const sessionExpiry = SessionService.getSessionExpiryData('access');
    
    /** 
     * Note: must be same as!
     * @link {SessionController.createUserSessionHandler}
     */
    const accessToken = SessionUtils.signJwt(
      { ...user, ...sessionExpiry, session: session },
      "accessTokenPrivateKey",
      // { expiresIn: `${config.accessTokenTtl}m` } // e.g. "30m" (30 minutes)
    );

    if (!accessToken) return ReissueAccessTokenErrorEnum.AuthServerError; // error signing new jwt token
  
    return accessToken;

  } catch (error) {
    return ReissueAccessTokenErrorEnum.AuthServerError;
  }
}