import type { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import type { BarrioDocument } from "../../models/barrio.model";
import { getRegionsListHandler, getListHandler } from './functions';
import type { ReadBarrioInput } from '../../schema/barrio/barrio.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BarriosService {
  static getRegionsList = async (): Promise<ScanResponse<BarrioDocument> | null> => getRegionsListHandler();
  
  static getList = async (queryParams?: ReadBarrioInput['query']): Promise<ScanResponse<BarrioDocument> | null> => getListHandler(queryParams);
}
