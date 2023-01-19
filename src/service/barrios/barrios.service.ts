import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { BarrioDocument } from "../../models/barrio.model";
import { getRegionsListHandler, getListHandler } from './functions';
import { ReadBarrioInput } from '../../schema/barrio/barrio.schema';

export class BarriosService {
  static getRegionsList = async (): Promise<ScanResponse<BarrioDocument> | null> => getRegionsListHandler();
  
  static getList = async (queryParams?: ReadBarrioInput['query']): Promise<ScanResponse<BarrioDocument> | null> => getListHandler(queryParams);
}
