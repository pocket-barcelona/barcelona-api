import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import type { ResetPasswordDocument } from '../../models/auth/reset-password.model.js';
import type UserModel from '../../models/auth/user.model.js';
import type { CheckResetTokenEnum, UserDocument, UserInput } from '../../models/auth/user.model.js';
import type { SessionInput } from '../../schema/session/session.schema.js';
import type { CheckResetTokenUserInput } from '../../schema/user/check-reset-token.schema.js';
import type { ConfirmEmailAddressUserInput } from '../../schema/user/confirm-email-address.js';
import type { ResetPasswordUserInput } from '../../schema/user/reset-password.schema.js';
import type { UpdateUserInput } from '../../schema/user/user.schema.js';
import {
	checkResetTokenHandler,
	confirmEmailAddressHandler,
	createUserHandler,
	forgotPasswordHandler,
	generatePasswordResetTokenHandler,
	getUserByEmailHandler,
	getUserByIdAndEmailHandler,
	getUsersHandler,
	resetPasswordHandler,
	sendWelcomeEmailHandler,
	updateUserHandler,
	validatePasswordHandler,
} from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserService {
	static checkResetToken = (user: CheckResetTokenUserInput): Promise<CheckResetTokenEnum> =>
		checkResetTokenHandler(user);

	static confirmEmailAddress = (input: ConfirmEmailAddressUserInput): Promise<boolean> =>
		confirmEmailAddressHandler(input);

	static createUser = async (input: Partial<UserInput>): Promise<UserDocument | null | string> =>
		createUserHandler(input);

	static forgotPassword = (document: ResetPasswordDocument, user: UserDocument): Promise<number> =>
		forgotPasswordHandler(document, user);

	static generatePasswordResetToken = (
		user: Pick<UserDocument, 'email'>
	): Promise<ResetPasswordDocument | null> => generatePasswordResetTokenHandler(user);

	static getUserByIdAndEmail = (
		email: (typeof UserModel)['email'],
		userId: (typeof UserModel)['userId']
	): Promise<UserDocument | null> => getUserByIdAndEmailHandler(email, userId);

	static getUserByEmail = (
		user: Pick<UserDocument, 'email'>,
		revealPasswordHash = false
	): Promise<UserDocument | null> => getUserByEmailHandler(user, revealPasswordHash);

	static getUsers = async (): Promise<ScanResponse<UserDocument> | null> => getUsersHandler();

	static resetPassword = (input: ResetPasswordUserInput): Promise<UserDocument | false> =>
		resetPasswordHandler(input);

	static sendWelcomeEmail = (user: UserDocument): Promise<boolean> => sendWelcomeEmailHandler(user);

	static updateUser = (input: UpdateUserInput): Promise<UserDocument | false> =>
		updateUserHandler(input);

	static validatePassword = (reqBody: SessionInput['body']): Promise<UserDocument | null> =>
		validatePasswordHandler(reqBody);
}
