import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "../../../service/admin/admin.service";
import { ReadBarrioInput } from '../../../schema/barrio/barrio.schema';

/**
 * Get a list of barrios
 * @param req
 * @param res
 * @returns
 */
export default async function (req: Request<any>, res: Response) {
  
  const data = await AdminService.uploadImage(req.body);

  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(
    success(data)
  );
}
