import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
// import { PlanBuilderInput } from "../../../models/plan.model";
import type { BuildPlanInput } from "../../../schema/plan/plan.schema";
import { PlannerService } from "../../../service/planner/planner.service";

/**
 * Create a structured x-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createStructuredPlan(
	req: Request<BuildPlanInput>,
	res: Response,
) {
	console.log("Logging payload", req.body);
	const data = await PlannerService.createStructuredPlan(req.body).catch(
		(e) => {
			console.log(e);
		},
	);
	// @todo
	if (!data) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Error getting itinerary", res.statusCode));
	}

	return res.send(success(data));
}
