import lodash from 'lodash';
import UserModel, { type UserDocument } from '../../../models/auth/user.model.js';

const { omit } = lodash;

/**
 * Return user if exists in the database, matching the given email
 * @param user
 * @param revealPasswordHash If true, the password hash string will be included in the returned document
 * @returns
 */
export default async function getUserByEmail(
	user: Pick<UserDocument, 'email'>,
	revealPasswordHash = false
): Promise<UserDocument | null> {
	// example on here: https://github.com/dynamoose/dynamoose/issues/35
	try {
		// const userFound = await UserModel
		// .query('email')
		// .eq(user.email.toString())
		// .exec();
		// return userFound.count > 0
		const userFound = await UserModel.get({
			email: user.email,
		}).catch((_error) => {
			// logger.warn(err)
			return null;
		});

		if (!userFound) return null;

		if (revealPasswordHash) {
			return userFound;
		}
		return omit(userFound, 'password') as UserDocument;
		// return user as UserDocument;
	} catch (_error) {
		// logger.info({'User not found': error})
	}
	return null;
}
