import express, { Express, Request, Response } from "express";
import { PlannerController } from "../controller/planner/planner.controller";
import validateResource from "../middleware/validateResource";
// import requireUser from "../middleware/requireUser";
import { readPlaceSchema } from "../schema/place/place.schema";

const router = express.Router()


// ########### PLANNER ###########
router.post("/random", [], PlannerController.createRandomPlanHandler);
router.post("/build", [], PlannerController.createStructuredPlanHandler);

export default router;
