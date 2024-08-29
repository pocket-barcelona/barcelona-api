import UserModel, { type UserDocument, UserEmailConfirmedEnum, type UserInput, UserStatusEnum } from "../../../models/auth/user.model";
import { v4 as uuidv4 } from 'uuid';
import lodash from 'lodash';
const { omit } = lodash;


export default async function createUser(input: UserInput): Promise<UserDocument | null | string> {
  try {
    const randomId = uuidv4();
    const userId: keyof UserDocument = 'userId';
    
    // set initial user document defaults
    const initialUserData: Pick<UserDocument, 'emailConfirmed' | 'userStatus' | 'utmSource' | 'utmMedium' | 'utmCampaign' | 'avatarColor'> = {
      emailConfirmed: UserEmailConfirmedEnum.Unconfirmed,
      userStatus: UserStatusEnum.Active,
      utmSource: input.utmSource || 'organic',
      utmMedium: input.utmMedium || 'none',
      utmCampaign: input.utmCampaign || 'none',
      avatarColor: input.avatarColor || '#ffffff'
    };
    // build user doc
    const newUserBody: Partial<UserDocument> = {
      ...input,
      ...initialUserData,
      ...{
        [userId]: randomId,
      },
    };

    const user = await UserModel.create(newUserBody);

    // only return certain field from the document
    return omit(user.toJSON(), "password") as UserDocument;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (e: any) {
    // throw new Error(e);
    if (e?.message) {
      return e.message
    }
    return null
  }
  
}