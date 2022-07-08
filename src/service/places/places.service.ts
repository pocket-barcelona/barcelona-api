import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument } from "../../models/place.model";
import { getListHandler, getByIdHandler, getRelatedPlacesHandler } from './functions';

export class PlacesService {

  static getList = async (): Promise<ScanResponse<PlaceDocument> | null> => getListHandler();

  static getById = async (placeId: PlaceDocument['placeId']): Promise<PlaceDocument | null> => getByIdHandler(placeId);

  static getRelatedPlaces = async (placeId: PlaceDocument['placeId']): Promise<ScanResponse<PlaceDocument> | null> => getRelatedPlacesHandler(placeId);
  
}
