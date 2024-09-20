import type { Request, Response } from "express";
import type { BuildPlanInput } from "../../schema/plan/plan.schema";
import { createRandomPlan, createStructuredPlan } from './handlers';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PlannerController {

  static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
  static createStructuredPlanHandler = (req: Request<BuildPlanInput>, res: Response) => createStructuredPlan(req, res);
  
}
