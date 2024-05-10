import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadPlaceInput } from "../../../schema/place/place.schema";

/**
 * Get a list of categories
 * @param req
 * @param res
 * @returns
 */
export default async function getPlaceCategories(req: Request, res: Response) {
  
  const records = await PlacesService.getPlaceCategories();
  
  if (!records) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(records));
}
