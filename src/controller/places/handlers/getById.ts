import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadPlaceInput } from "../../../schema/place/place.schema";

/**
 * Get a place by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(req: Request<ReadPlaceInput['params']>, res: Response) {
  
  const record = await PlacesService.getById(req.body);
  
  if (!record) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(record));
}
