import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
// import { PlanBuilderInput } from "../../../models/plan.model.js";
import type { BuildPlanInput } from '../../../schema/plan/plan.schema.js';
import PlannerService from '../../../service/planner/planner.service.js';

/**
 * Create a structured x-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createStructuredPlan(req: Request<BuildPlanInput>, res: Response) {
	// console.log('Logging payload', req.body);
	const data = await PlannerService.createStructuredPlan(req.body).catch((e) => {
		console.log(e);
	});
	// @todo
	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting itinerary', res.statusCode));
	}

	return res.send(success(data));
}
