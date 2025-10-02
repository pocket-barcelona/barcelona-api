import type { Request, Response } from 'express';
import type { BuildPlanInput } from '../../schema/planner/planner.schema.js';
import { createRandomPlan, createStructuredPlan } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PlannerController {
	static createRandomPlanHandler = (req: Request, res: Response) => createRandomPlan(req, res);
	static createStructuredPlanHandler = (
		req: Request<unknown, unknown, BuildPlanInput['body']>,
		res: Response
	) => createStructuredPlan(req, res);
}
