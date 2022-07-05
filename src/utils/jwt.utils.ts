import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import logger from "./logger";

export namespace SessionUtils {

  /**
   * Sign the JWT with a private key
   * @link https://youtu.be/BWUi6BS9T5Y?t=3845
   * @param object 
   * @param keyName 
   * @param options 
   * @returns 
   */
  export function signJwt(
    object: Object,
    keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
    options?: jwt.SignOptions | undefined
  ): string | undefined {
    let privateKey: string;
    if (keyName === 'refreshTokenPrivateKey') {
      privateKey = config.refreshTokenPrivateKey;
    } else {
      privateKey = config.accessTokenPrivateKey;
    }
    const signingKey = Buffer.from(
      privateKey,
      "base64"
    ).toString("ascii");
    
    try {
      // return jwt.sign(object, signingKey, options);
      return jwt.sign(object, signingKey);
      
    } catch (error) {
      logger.error(error)
      return undefined
    }
  }

  export interface JWTTokenValidity {
    valid: boolean;
    expired: boolean;
    decoded: string | JwtPayload | null
  }
  
  /**
   * Verify the JWT with a public key. Compare the user's token to see if it was
   * signed by one of the private server keys -- either the refresh or access secrets
   * @link https://youtu.be/BWUi6BS9T5Y?t=3845
   * @param token 
   * @param keyName 
   * @returns 
   */
  export function verifyJwt(
    token: string,
    keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
  ) {
    let publicKey = '';
    
    if (keyName === 'refreshTokenPublicKey') {
      publicKey = Buffer.from(config.refreshTokenPrivateKey, "base64").toString(
        "ascii"
      );
    } else {
      publicKey = Buffer.from(config.accessTokenPrivateKey, "base64").toString(
        "ascii"
      );
    }
    let validity: JWTTokenValidity;
  
    try {
      const decoded = jwt.verify(token, publicKey) as any;
      const { exp } = decoded;
      const expired = new Date().getTime() > (exp || 0);
      validity = {
        valid: true,
        expired: expired,
        decoded,
      };
    } catch (e: any) {
      // logger.warn('############### BAD / EMPTY TOKEN ##################');
      // console.error(e);
      
      validity = {
        valid: false,
        expired: e.message === "JWT expired",
        decoded: null,
      };
    }

    return validity;
  }
}
