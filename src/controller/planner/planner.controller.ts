import { Request, Response } from "express";
import { CreatePlanInput } from "../../schema/plan/plan.schema";
import { createRandomPlan, createStructuredPlan } from './handlers';

export class PlannerController {

  static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
  static createStructuredPlanHandler = (req: Request<CreatePlanInput>, res: Response) => createStructuredPlan(req, res);
  
  
}
