import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PoiDocument } from "../../models/poi.model";
import { FilterByPoiInput } from "../../schema/poi/poi.schema";
// import { getListHandler, getByIdHandler } from './functions';
import { getListHandler } from './functions';

export class PoiService {

  static getList = async (filters: FilterByPoiInput): Promise<ScanResponse<PoiDocument> | null> => getListHandler(filters);
  
}
