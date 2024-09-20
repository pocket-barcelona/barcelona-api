import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import type { PoiDocument } from "../../models/poi.model";
import type { FilterByPoiInput } from "../../schema/poi/poi.schema";
import { getListHandler } from './functions';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PoiService {

  static getList = async (filters: FilterByPoiInput['body']): Promise<ScanResponse<PoiDocument> | null> => getListHandler(filters);
  
}
