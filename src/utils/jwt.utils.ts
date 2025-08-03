import { createSecretKey } from "node:crypto";
import "dotenv/config";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { nanoid } from "nanoid";
import { config } from "../config";
import logger from "./logger";

// const secretKey = createSecretKey(config.JWT_SECRET, 'utf-8');
export namespace SessionUtils {
	/**
	 * Sign the JWT with a private key
	 * @link - OLD using jwt: https://youtu.be/BWUi6BS9T5Y?t=3845
	 * @param object
	 * @param keyName
	 * @param options
	 * @returns
	 */
	export async function signJwt(
		object: object,
		keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
	): Promise<string | undefined> {
		let privateKey: string;
		if (keyName === "refreshTokenPrivateKey") {
			privateKey = `${config.refreshTokenPrivateKey}`;
		} else {
			privateKey = `${config.accessTokenPrivateKey}`;
		}
		// const signingKey = new TextEncoder().encode(privateKey);
		const signingKey = createSecretKey(privateKey, "utf-8");

		try {
			const token = await new SignJWT({
				...object,
			})
				.setProtectedHeader({ alg: "HS256" })
				.setJti(nanoid())
				.setIssuedAt()
				// .setIssuer(process.env.JWT_ISSUER ?? '') // issuer
				// .setAudience(process.env.JWT_AUDIENCE ?? '') // audience
				.setExpirationTime("6h")
				.sign(signingKey);
			return token;
		} catch (error) {
			logger.error(error);
			return undefined;
		}
	}

	export interface JWTTokenValidity {
		valid: boolean;
		expired: boolean;
		decoded: string | JWTPayload | null;
	}

	/**
	 * Verify the JWT with a public key. Compare the user's token to see if it was
	 * signed by one of the private server keys -- either the refresh or access secrets
	 * @link OLD using jwt: https://youtu.be/BWUi6BS9T5Y?t=3845
	 * @param token The token should not contain "Bearer ".
	 * @param keyName
	 * @returns
	 */
	export async function verifyJwt(
		token: string,
		keyName: "accessTokenPublicKey" | "refreshTokenPublicKey", // @todo - PrivateKey?
	) {
		let privateKey: string;
		if (keyName === "refreshTokenPublicKey") {
			privateKey = `${config.refreshTokenPrivateKey}`;
		} else {
			privateKey = `${config.accessTokenPrivateKey}`;
		}

		// const signingKey = new TextEncoder().encode(privateKey);
		const signingKey = createSecretKey(privateKey, "utf-8");
		// let publicKey = '';

		// if (keyName === 'refreshTokenPublicKey') {
		//   publicKey = Buffer.from(config.refreshTokenPrivateKey, "base64").toString(
		//     "ascii"
		//   );
		// } else {
		//   publicKey = Buffer.from(config.accessTokenPrivateKey, "base64").toString(
		//     "ascii"
		//   );
		// }
		let validity: JWTTokenValidity;

		try {
			const decoded = await jwtVerify(token, signingKey);
			const { payload } = decoded;
			const { exp } = payload;
			const expired = Date.now() > (exp || 0) * 1000;
			validity = {
				valid: true,
				expired: expired,
				decoded: payload,
			};
			// biome-ignore lint/suspicious/noExplicitAny: TODO
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
