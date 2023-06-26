import express, { Express, Request, Response } from "express";
import { UserController } from "../controller/user/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createUserSchema, deleteUserSchema, updateUserSchema } from "../schema/user/user.schema";
import { confirmEmailAddressSchema } from "../schema/user/confirm-email-address";
import { checkResetTokenUserSchema } from "../schema/user/check-reset-token.schema";
import { forgotPasswordUserSchema } from "../schema/user/forgot-password.schema";
import { resetPasswordUserSchema } from "../schema/user/reset-password.schema";

const router = express.Router()

// ########### USERS ###########

// THIS IS ONLY FOR LOCAL TEST!
// router.get("/api/users", [requireUser], UserController.getListHandler);

router.post("/", [validateResource(createUserSchema)], UserController.createUserHandler);

// update user details
router.patch("/:userId", [requireUser, validateResource(updateUserSchema)], UserController.updateUserHandler);

router.delete("/:userId", [requireUser, validateResource(deleteUserSchema)], UserController.deleteUserHandler);
// get logged in user
router.get("/current-user", [requireUser], UserController.getLoggedInUserHandler);

router.post("/confirm-email", [validateResource(confirmEmailAddressSchema)], UserController.confirmEmailAddressHandler);

// ########### RESETTING PASSWORD ###########

// forgot password
// requires: email address
router.post("/forgot-password", [validateResource(forgotPasswordUserSchema)], UserController.forgotPasswordHandler);

// check reset password token
// requires: email address, reset token
router.post("/check-reset-token", [validateResource(checkResetTokenUserSchema)], UserController.checkResetTokenHandler);

// reset the user's password
// requires: email address, token, new password, new password again
router.post("/reset-password", [validateResource(resetPasswordUserSchema)], UserController.resetPasswordHandler);

export default router;
// module.exports = router;