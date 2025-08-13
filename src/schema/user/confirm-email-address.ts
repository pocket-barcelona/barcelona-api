import { object, string, type TypeOf } from 'zod';

export const confirmEmailAddressSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required',
		}),
		token: string({
			required_error: 'Token is required',
		}),
	}),
});

export type ConfirmEmailAddressUserInput = TypeOf<typeof confirmEmailAddressSchema>;
