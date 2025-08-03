import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import type { UserDocument } from "./user.model";

export interface SessionTokenModel {
	accessToken: string;
	refreshToken: string;
}
export interface SessionExpiry {
	/** The moment that the session was created */
	iat: number;
	/** The future expiry timestamp of the session */
	exp: number;
}

export interface SessionDocument extends Item {
	user: UserDocument["email"];
	valid: boolean;
	userAgent: string;
	createdAt: Date;
	updatedAt: Date;
}

const sessionSchema = new dynamoose.Schema({
	user: {
		required: true,
		type: String,
		hashKey: true,
	},
	valid: {
		type: Boolean,
		default: true,
	},
	userAgent: {
		type: String,
	},
	createdAt: {
		type: Date,
	},
	updatedAt: {
		type: Date,
	},
});

const SessionModel = dynamoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
