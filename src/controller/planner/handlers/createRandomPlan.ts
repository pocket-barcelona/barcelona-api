import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlannerService } from "../../../service/planner/planner.service";

/**
 * Create a random 1-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createRandomPlan(req: Request, res: Response) {
  
  const data = await PlannerService.createRandomPlan();
  
  // @todo
  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(data));
}
