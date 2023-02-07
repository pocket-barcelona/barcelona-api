import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlannerService } from "../../../service/planner/planner.service";
import { PlanBuilderInput } from "../../../models/plan.model";
import { BuildPlanInput } from "../../../schema/plan/plan.schema";

/**
 * Create a structured x-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createStructuredPlan(req: Request<BuildPlanInput>, res: Response) {
  
  console.log('Logging payload', req.body);
  const data = await PlannerService.createStructuredPlan(req.body)
  .catch((e) => {
    console.log(e);
  });
  // @todo
  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting itinerary", res.statusCode));
  }

  return res.send(success(data));
}
