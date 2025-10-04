import { v4 as uuidv4 } from 'uuid';
import ResetPasswordModel, {
	type ResetPasswordDocument,
} from '../../../models/auth/reset-password.model.js';
import type { UserDocument } from '../../../models/auth/user.model.js';

/**
 * Generate and return a new password reset document
 * @param user
 * @returns
 */
export default async function generatePasswordResetToken(
	user: Pick<UserDocument, 'email'>
): Promise<ResetPasswordDocument | null> {
	const resetToken = uuidv4();

	const resetDocument: ResetPasswordDocument | null = null;
	try {
		// calling update will create OR update, depending on if the document exists or not!
		const resetDocument = await ResetPasswordModel.update({
			email: user.email.toString(),
			resetToken: resetToken,
			resetTimestamp: Date.now(),
		});

		// return processed.unprocessedItems.length === 0 ? processed

		return resetDocument;
	} catch (_error) {
		// logger.warn({ "Problem creating reset token for": user.email });
	}
	return resetDocument;
}
