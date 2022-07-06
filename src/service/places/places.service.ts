import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument } from "../../models/place.model";
import { getListHandler } from './functions';

export class PlacesService {

  static getList = async (): Promise<ScanResponse<PlaceDocument> | null> => getListHandler();
}
