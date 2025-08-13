import express from 'express';
import { SessionController } from '../controller/session/session.controller.js';
import requireRefreshToken from '../middleware/requireRefreshToken.js';
import requireUser from '../middleware/requireUser.js';
import validateResource from '../middleware/validateResource.js';
import { createSessionSchema } from '../schema/session/session.schema.js';

const router = express.Router();

// ########### SESSIONS ###########

/** Create a new session (Login the user). Accepts {{email}} and {{password}} POST fields */
router.post('/', [validateResource(createSessionSchema)], SessionController.createSessionHandler);
/** Get active user session/s */
router.get('/', [requireUser], SessionController.getSessionsHandler);
/** Refresh the user session */
router.post('/refresh', [requireRefreshToken], SessionController.refreshSessionHandler);
/** Logout the user */
router.delete('/delete', [requireUser], SessionController.deleteSessionHandler);

export default router;
// module.exports = router;
