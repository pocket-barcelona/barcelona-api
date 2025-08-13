import type { Request, Response } from 'express';
import type { CheckResetTokenUserInput } from '../../schema/user/check-reset-token.schema.js';
import type { ConfirmEmailAddressUserInput } from '../../schema/user/confirm-email-address.js';
import type { ForgotPasswordUserInput } from '../../schema/user/forgot-password.schema.js';
import type { ResetPasswordUserInput } from '../../schema/user/reset-password.schema.js';
import type {
	CreateUserInput,
	DeleteUserInput,
	ReadUserInput,
	UpdateUserInput,
} from '../../schema/user/user.schema.js';
import {
	checkResetToken,
	confirmEmailAddress,
	createUser,
	deleteUser,
	forgotPassword,
	getList,
	getLoggedInUser,
	resetPassword,
	updateUser,
} from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: TODO
export class UserController {
	// static getListHandler = (req: Request, res: Response) =>

	static checkResetTokenHandler = (
		req: Request<unknown, unknown, CheckResetTokenUserInput['body']>,
		res: Response
	) => checkResetToken(req, res);

	static confirmEmailAddressHandler = (
		req: Request<unknown, unknown, ConfirmEmailAddressUserInput['body']>,
		res: Response
	) => confirmEmailAddress(req, res);

	/** Signup */
	static createUserHandler = (
		req: Request<unknown, unknown, CreateUserInput['body']>,
		res: Response
	) => createUser(req, res);

	static deleteUserHandler = (
		req: Request<DeleteUserInput['params'], unknown, DeleteUserInput['body']>,
		res: Response
	) => deleteUser(req, res);

	static forgotPasswordHandler = (
		req: Request<unknown, unknown, ForgotPasswordUserInput['body']>,
		res: Response
	) => forgotPassword(req, res);

	static getListHandler = (req: Request, res: Response) => getList(req, res);

	static getLoggedInUserHandler = (req: Request, res: Response) => getLoggedInUser(req, res);

	static resetPasswordHandler = (
		req: Request<unknown, unknown, ResetPasswordUserInput['body']>,
		res: Response
	) => resetPassword(req, res);

	static updateUserHandler = (
		req: Request<ReadUserInput['params'], unknown, UpdateUserInput['body']>,
		res: Response
	) => updateUser(req, res);
}
