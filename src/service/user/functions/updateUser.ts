import lodash from 'lodash';
import UserModel, { type UserDocument } from '../../../models/auth/user.model.js';
import type { UpdateUserInput } from '../../../schema/user/user.schema.js';

const { omit } = lodash;

export default async function updateUser(input: UpdateUserInput): Promise<UserDocument | false> {
	try {
		const user = await UserModel.update(input.body);
		// only return certain field from the document
		return omit(user.toJSON(), 'password') as UserDocument;
	} catch (e: unknown) {
		// throw new Error(e);
		// logger.warn(e)
		return false;
	}
}
