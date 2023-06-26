import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import UserModel, { UserDocument } from "../../../models/auth/user.model";

type UserListAttributesType = keyof Pick<UserDocument, 'name' | 'email' | 'createdAt'>;

export default async function getUsers(): Promise<ScanResponse<UserDocument> | null> {
  const scanAttributes: UserListAttributesType[] = [
    "name",
    "email",
    "createdAt",
  ];
  try {
    const result = UserModel.scan().attributes(scanAttributes).exec();

    return await result.catch((err: any) => {
      // logger.warn(err);
      return null;
    });
  } catch (e) {
    return null;
  }
}
