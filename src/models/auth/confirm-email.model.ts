import type { UserDocument } from "./user.model";


export interface ConfirmEmail {
  email: UserDocument['email'];
}