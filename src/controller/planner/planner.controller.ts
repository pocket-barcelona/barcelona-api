import type { Request, Response } from 'express';
import type { BuildPlanInput } from '../../schema/plan/plan.schema.js';
import { createRandomPlan, createStructuredPlan } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PlannerController {
	static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
	static createStructuredPlanHandler = (req: Request<BuildPlanInput>, res: Response) =>
		createStructuredPlan(req, res);
}
