import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadPlaceInput } from "../../../schema/place/place.schema";

/**
 * Get a list of related places, to this one
 * @param req
 * @param res
 * @returns
 */
export default async function getRelatedPlaces(req: Request<ReadPlaceInput['params']>, res: Response) {
  
  const records = await PlacesService.getRelatedPlaces(req.body);
  
  if (!records) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(records));
}
