import { Request, Response } from "express";
import { BuildPlanInput } from "../../schema/plan/plan.schema";
import { createRandomPlan, createStructuredPlan } from './handlers';

export class PlannerController {

  static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
  static createStructuredPlanHandler = (req: Request<BuildPlanInput>, res: Response) => createStructuredPlan(req, res);
  
  
}
