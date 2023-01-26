import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { GuidesService } from "../../../service/guides/guides.service";

/**
 * Get a list of guides
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  
  const data = await GuidesService.getList();

  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
