import { Request, Response } from "express";
import { createRandomPlan, createStructuredPlan } from './handlers';

export class PlannerController {

  static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
  static createStructuredPlanHandler = (req: Request, res: Response) => createStructuredPlan(req, res);
  
  
}
