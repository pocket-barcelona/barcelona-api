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
  
  const records = await PlacesService.getRelatedPlaces(req.params);
  
  if (!records) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  const mappedRecords = PlacesService.getMappedPlaceDocuments(records.slice(0, 12));

  return res.send(success(mappedRecords));
}
