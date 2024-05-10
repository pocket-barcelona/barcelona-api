import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { PlaceDocument } from '../../../models/place.model';

/**
 * Get a simple list of place Ids and their names for the Dashboard
 * @param req
 * @param res
 * @returns
 */
export default async function getPlaceLookup(req: Request, res: Response) {
  
  const scanResp = await PlacesService.getPlaceLookupList();
  const records: PlaceDocument[] = scanResp ? scanResp.toJSON() as PlaceDocument[] : [];
  
  if (!records) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting items", res.statusCode));
  }
  const mappedRecords = PlacesService.getMappedLookupPlace(records);

  return res.send(success(mappedRecords));
}
