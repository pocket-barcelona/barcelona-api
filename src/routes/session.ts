import express from "express";
import { SessionController } from "../controller/session/session.controller";
import requireRefreshToken from "../middleware/requireRefreshToken";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createSessionSchema } from "../schema/session/session.schema";

const router = express.Router();

// ########### SESSIONS ###########

/** Create a new session (Login the user). Accepts {{email}} and {{password}} POST fields */
router.post(
	"/",
	[validateResource(createSessionSchema)],
	SessionController.createSessionHandler,
);
/** Get active user session/s */
router.get("/", [requireUser], SessionController.getSessionsHandler);
/** Refresh the user session */
router.post(
	"/refresh",
	[requireRefreshToken],
	SessionController.refreshSessionHandler,
);
/** Logout the user */
router.delete("/delete", [requireUser], SessionController.deleteSessionHandler);

export default router;
// module.exports = router;
