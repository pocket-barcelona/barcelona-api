import { number, object, string, type TypeOf } from 'zod';
import { USER_MAXIMUM_PASSWORD_LENGTH, USER_MINIMUM_PASSWORD_LENGTH } from './constants.js';

const userIdField = {
	userId: string({
		required_error: 'User ID is required',
	}),
};
const emailField = {
	email: string({
		required_error: 'Email address is required',
	}).email('Invalid email address'),
};

const userEditableFields = {
	firstname: string({
		required_error: 'Firstname is required',
		invalid_type_error: 'Firstname must be a string',
	}),
	lastname: string({
		required_error: 'Lastname is required',
		invalid_type_error: 'Lastname must be a string',
	}).optional(),
	telegram: string().optional(),
	mobile: string().optional(),
	identity: object({
		documentNumber: string(),
		documentType: string(),
	}).optional(),
	about: string().optional(),
	currentLocation: string().optional(),
	barrioId: number().optional(),
	arrivedInBarcelona: string().optional(),
	interests: string().array().optional(),
	followingGroupIds: string().array().optional(),
	utmSource: string().optional(),
	utmMedium: string().optional(),
	utmCampaign: string().optional(),
	avatarColor: string().optional(),
};

const createPayload = {
	body: object({
		...emailField,

		// account related
		password: string({
			required_error: 'Name is required',
		})
			.min(USER_MINIMUM_PASSWORD_LENGTH, 'Password is too short')
			.max(USER_MAXIMUM_PASSWORD_LENGTH, 'Password is too long'),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required',
		}),
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation'],
	}),
};

export const createUserSchema = object({
	...createPayload,
});

const getParams = {
	...userIdField,
};

export const updateUserSchema = object({
	body: object({
		...userEditableFields,
		...emailField,
	}),
});

export const getUserSchema = object({
	params: object({
		...getParams,
	}),
});

export const deleteUserSchema = object({
	params: object({
		...getParams,
	}),
	body: object({
		...emailField,
	}),
});

// get type from schema // https://www.npmjs.com/package/zod#what-is-zod .shape
// createUserSchema.shape.body._input.email

// also possible // https://www.npmjs.com/package/zod#what-is-zod
// import { z } from "zod";
// export type CreateUserInput = z.infer<typeof createUserSchema>

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, 'body.passwordConfirmation'>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type ReadUserInput = TypeOf<typeof getUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
