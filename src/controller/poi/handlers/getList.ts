import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PoiService } from "../../../service/poi/poi.service";

/**
 * Get a list of points of interest
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  // accept some criteria for filtering
  // lat/lng
  // todo - work out what lat/lng distance equates to e.g. 100m in distance?
  

  const data = await PoiService.getList();

  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
