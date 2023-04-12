import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadPlaceInput } from "../../../schema/place/place.schema";
import { PlaceDocument } from '../../../models/place.model';

/**
 * Get a list of place Ids for searching
 * @param req
 * @param res
 * @returns
 */
export default async function getSearchPrepopulate(req: Request, res: Response) {
  
  const scanResp = await PlacesService.getSearchPrepopulate();
  const records: PlaceDocument[] = scanResp ? scanResp.toJSON() as PlaceDocument[] : [];
  
  if (!records) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting items", res.statusCode));
  }
  const mappedRecords = PlacesService.getMappedSearchPlace(records);

  return res.send(success(mappedRecords));
}
