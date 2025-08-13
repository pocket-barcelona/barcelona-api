import lodash from 'lodash';
import type { UserDocument } from '../../../models/auth/user.model.js';
import type { SessionInput } from '../../../schema/session/session.schema.js';
import { UserService } from '../user.service.js';
import { UserUtils } from '../user.utils.js';

const { omit } = lodash;

/**
 * Validate user password against one stored in the DB
 * @param reqBody SessionInput['body']
 * @returns
 */
export default async function validatePassword(
	reqBody: SessionInput['body']
): Promise<UserDocument | null> {
	// const user = await UserModel.findOne({ email });
	const { password, email } = reqBody;
	if (!password || !email) {
		// no password to check!
		return null;
		// return Promise.resolve(null);
	}

	const userDocument = await UserService.getUserByEmail({ email }, true);
	if (!userDocument) {
		// logger.warn('Could not find user');
		// return Promise.resolve(null)
		return null;
	}

	/** @todo - https://dynamoosejs.com/guide/Model#modelmethodssetname-function */
	const isValid = await UserUtils.comparePassword(userDocument.password, password);

	if (!isValid) return null; // passwords did not match

	// password is good, return user
	return omit(userDocument, 'password') as UserDocument;
}
