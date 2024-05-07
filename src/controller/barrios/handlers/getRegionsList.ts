import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { BarriosService } from "../../../service/barrios/barrios.service";

/**
 * Get a list of barrio top-level barrio regions
 * @param req
 * @param res
 * @returns
 */
export default async function getRegionsList(req: Request, res: Response) {
  
  const data = await BarriosService.getRegionsList();

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
