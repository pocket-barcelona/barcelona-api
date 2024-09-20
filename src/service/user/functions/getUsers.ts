import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import UserModel, { type UserDocument } from "../../../models/auth/user.model";

type UserListAttributesType = keyof Pick<UserDocument, 'name' | 'email' | 'createdAt'>;

export default async function getUsers(): Promise<ScanResponse<UserDocument> | null> {
  const scanAttributes: UserListAttributesType[] = [
    "name",
    "email",
    "createdAt",
  ];
  try {
    const result = UserModel.scan().attributes(scanAttributes).exec();

    return await result.catch((err: unknown) => {
      // logger.warn(err);
      return null;
    });
  } catch (e) {
    return null;
  }
}
