import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadExploreInput } from '../../../schema/explore/explore.schema';

/**
 * Get a list of places, filtered by url params
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request<any, any, any, ReadExploreInput['body']>, res: Response) {
  
  const records = await PlacesService.getList(req.body);
  
  if (!records) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  const mappedRecords = PlacesService.getMappedPlaceDocuments(records);

  return res.send(success(mappedRecords));
}
