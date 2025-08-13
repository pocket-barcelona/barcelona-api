import type { UserDocument } from './user.model.js';

export interface ConfirmEmail {
	email: UserDocument['email'];
}
