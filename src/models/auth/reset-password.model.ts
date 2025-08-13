import dynamoose from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item';

export interface ResetPasswordInput {
	email: string;
	resetToken: string;
	resetTimestamp: number;
}

export interface ResetPasswordDocument extends Item, ResetPasswordInput {
	createdAt: Date;
	updatedAt: Date;
}

const resetPasswordSchema = new dynamoose.Schema(
	{
		email: {
			type: String,
			required: true,
			hashKey: true,
		},
		resetToken: {
			type: String,
			required: true,
		},
		resetTimestamp: {
			type: Number,
			required: true,
		},
	},
	{
		// timestamps: true,
	}
);

export const RESET_PASSWORD_TABLE_NAME = 'ResetPassword';
const ResetPasswordModel = dynamoose.model<ResetPasswordDocument>(
	RESET_PASSWORD_TABLE_NAME,
	resetPasswordSchema
);

export default ResetPasswordModel;
