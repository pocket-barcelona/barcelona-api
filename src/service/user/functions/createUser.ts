import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import UserModel, {
	type UserDocument,
	UserEmailConfirmedEnum,
	type UserInput,
	UserRoleEnum,
	UserStatusEnum,
} from '../../../models/auth/user.model.js';

const { pick } = lodash;

export default async function createUser(
	input: Partial<UserInput>
): Promise<UserDocument | null | string> {
	try {
		const newUUID = uuidv4();

		const initialUserData: Partial<UserDocument> = {
			emailConfirmed: UserEmailConfirmedEnum.Unconfirmed,
			userStatus: UserStatusEnum.Active,
			userId: newUUID,
			authMethod: 'EMAIL',
			signupDate: new Date(),
			lastLogin: new Date(),
			isVerified: false,
			role: UserRoleEnum.User,
			credit: 0,
			firstname: input.firstname || '',
			lastname: input.lastname || '',
			// utmSource: input.utmSource || 'organic',
			// utmMedium: input.utmMedium || 'none',
			// utmCampaign: input.utmCampaign || 'none',
			// avatarColor: input.avatarColor || '#ffffff'
		};

		// build user document
		const newUserBody: Partial<UserDocument> = {
			...input,
			...initialUserData,
		};

		const user = await UserModel.create(newUserBody);

		const pickedFields: Array<keyof UserDocument> = [
			'email',
			'firstname',
			'lastname',
			'userStatus',
			'userId',
		];
		// only return certain fields from the document
		return pick(user.toJSON(), ...pickedFields) as UserDocument;
	} catch (e: unknown) {
		// throw new Error(e);
		if (e instanceof Error) {
			return e.message;
		}
		return null;
	}
}
