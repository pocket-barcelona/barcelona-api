import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { BuildPlanInput } from '../../../schema/planner/planner.schema.js';
import PlannerService from '../../../service/planner/planner.service.js';

/**
 * Create a structured x-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createStructuredPlan(
	req: Request<unknown, unknown, BuildPlanInput['body']>,
	res: Response
) {
	const data = await PlannerService.createStructuredPlan(req.body).catch((error) => {
		console.log(error);
	});
	if (!data) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(
				error(
					"Sorry, we couldn't create a plan with those criteria. Please narrow down your search so we can include more results.",
					res.statusCode
				)
			);
	}

	return res.send(success(data));
}
