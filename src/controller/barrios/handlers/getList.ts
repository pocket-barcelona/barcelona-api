import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { BarriosService } from "../../../service/barrios/barrios.service";

/**
 * Get a list of barrios
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  
  const overview = await BarriosService.getList();

  if (!overview) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(overview));
}
