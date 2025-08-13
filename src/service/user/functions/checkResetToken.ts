import ResetPasswordModel from '../../../models/auth/reset-password.model.js';
import { CheckResetTokenEnum } from '../../../models/auth/user.model.js';
import type { CheckResetTokenUserInput } from '../../../schema/user/check-reset-token.schema.js';
import { USER_RESET_PASSWORD_LINK_EXPIRY } from '../../../schema/user/constants.js';

/**
 * Check to see if the reset token and email are in the database and that the token has not expired
 * @param user
 * @returns boolean
 */
export default async function checkResetToken(
	user: CheckResetTokenUserInput
): Promise<CheckResetTokenEnum> {
	// check to see if the reset token and email combo exist in the tokens table
	try {
		const resetDocument = await ResetPasswordModel.get({
			// @todo - allow emails with a "+" in them!!
			email: user.body.email.trim().replace(' ', '+'),
			// 'resetToken': user.body.token,
		});

		if (!resetDocument) {
			return CheckResetTokenEnum.NoDocument;
		}

		if (resetDocument.resetToken !== user.body.token) {
			return CheckResetTokenEnum.TokenMismatch;
		}
		// the documents are indexed by email so manually check the token against the request body

		// check timestamp expirt
		const timestamp = resetDocument.resetTimestamp ?? 0;
		const timeNow = new Date().getTime();
		const resetLinkIsValid = Number(timestamp) + USER_RESET_PASSWORD_LINK_EXPIRY > timeNow;
		return resetLinkIsValid ? CheckResetTokenEnum.TokenValid : CheckResetTokenEnum.TokenExpired;
	} catch (error) {
		// logger.warn('Error fetching reset password document');
	}
	return CheckResetTokenEnum.NoDocument;
}
