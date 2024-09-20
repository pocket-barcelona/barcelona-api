import { object, string, type TypeOf } from "zod";

/**
 * @openapi
 * components:
 *  schemas:
 *    CheckResetTokenUserInput:
 *      type: object
 *      required:
 *        - email
 *        - token
 *      properties:
 *        email:
 *          type: string
 *          default: foobar
 *        token:
 *          type: string
 *          default: foobar
 *    CheckResetTokenUserResponse:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 */
export const checkResetTokenUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }),
    token: string({
      required_error: "Token is required",
    }),
  })
});

export type CheckResetTokenUserInput = TypeOf<typeof checkResetTokenUserSchema>;
