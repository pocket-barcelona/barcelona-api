import express from 'express';
import { PlannerController } from '../controller/planner/planner.controller.js';
import validateResource from '../middleware/validateResource.js';
// import requireUser from "../middleware/requireUser.js";
import { buildPlanSchema } from '../schema/planner/planner.schema.js';

const router = express.Router();

// ########### PLANNER ###########
router.post('/random', [], PlannerController.createRandomPlanHandler);
router.post(
	'/build',
	[validateResource(buildPlanSchema)],
	PlannerController.createStructuredPlanHandler
);

export default router;
