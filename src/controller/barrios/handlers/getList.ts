import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { BarriosService } from "../../../service/barrios/barrios.service";
import { ReadBarrioInput } from '../../../schema/barrio/barrio.schema';

/**
 * Get a list of barrios
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request<ReadBarrioInput>, res: Response) {
  
  const data = await BarriosService.getList(req.query);

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(
    success(data)
  );
}
