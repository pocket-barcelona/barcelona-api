import { z, object, string, TypeOf } from "zod";
import { USER_MAXIMUM_PASSWORD_LENGTH, USER_MINIMUM_PASSWORD_LENGTH } from "./constants";

const userIdField = {
  userId: string({
    required_error: "User ID is required",
  })
}
const emailField = {
  email: string({
    required_error: "Email is required",
  }).email("Not a valid email")
}

const userEditableFields = {
  name: string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  })
}

const createPayload = {
  body: object({
    ...userEditableFields,

    ...emailField,

    // account related
    password: string({
      required_error: "Name is required",
    })
    .min(USER_MINIMUM_PASSWORD_LENGTH, "Password is too short")
    .max(USER_MAXIMUM_PASSWORD_LENGTH, "Password is too long"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),

  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
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
    ...getParams
  }),
});

export const deleteUserSchema = object({
  params: object({
    ...getParams
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

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
export type ReadUserInput = TypeOf<typeof getUserSchema>;
export type DeleteUserInput = TypeOf<typeof deleteUserSchema>;
