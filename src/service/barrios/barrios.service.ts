import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { BarrioDocument } from "../../models/barrio.model";
import { getListHandler } from './functions';

export class BarriosService {

  static getList = async (parentId?: BarrioDocument['barrioId']): Promise<ScanResponse<BarrioDocument> | null> => getListHandler(parentId);
}
