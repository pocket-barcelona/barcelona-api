import { object, string, type TypeOf } from 'zod';

/**
 * @openapi
 * components:
 *  schemas:
 *    ForgotPasswordUserInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *    ForgotPasswordUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 */
export const forgotPasswordUserSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
	}),
});

export type ForgotPasswordUserInput = TypeOf<typeof forgotPasswordUserSchema>;
