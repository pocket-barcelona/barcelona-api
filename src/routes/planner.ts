import express from 'express';
import { PlannerController } from '../controller/planner/planner.controller.js';
import validateResource from '../middleware/validateResource.js';
// import requireUser from "../middleware/requireUser.js";
import { readPlaceSchema } from '../schema/place/place.schema.js';

const router = express.Router();

// ########### PLANNER ###########
router.post('/random', [], PlannerController.createRandomPlanHandler);
router.post('/build', [], PlannerController.createStructuredPlanHandler);

export default router;
