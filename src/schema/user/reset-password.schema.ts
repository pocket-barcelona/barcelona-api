import { object, string, TypeOf } from "zod";
import { USER_MAXIMUM_PASSWORD_LENGTH, USER_MINIMUM_PASSWORD_LENGTH } from "./constants";

// /**
//  * @openapi
//  * components:
//  *  schemas:
//  *    ResetPasswordUserInput:
//  *      type: object
//  *      required:
//  *        - email
//  *        - token
//  *        - password
//  *        - passwordConfirmation
//  *      properties:
//  *        email:
//  *          type: string
//  *          default: jane.doe@example.com
//  *        token:
//  *          type: string
//  *          default: foobar
//  *        password:
//  *          type: string
//  *          default: stringPassword123
//  *        passwordConfirmation:
//  *          type: string
//  *          default: stringPassword123
//  *    ResetPasswordResponse:
//  *      type: object
//  *      properties:
//  *        email:
//  *          type: string
//  */
export const resetPasswordUserSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    })
    .min(USER_MINIMUM_PASSWORD_LENGTH, "Password is too short")
    .max(USER_MAXIMUM_PASSWORD_LENGTH, "Password is too long"),

    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),

    token: string({
      required_error: "Token is required",
    }),

    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),

  }).refine((data) => data.password === data.passwordConfirmation, {

    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  }),

});

export type ResetPasswordUserInput = Omit<
  TypeOf<typeof resetPasswordUserSchema>,
  "body.passwordConfirmation"
>;
