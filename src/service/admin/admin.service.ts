import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { BarrioDocument } from "../../models/barrio.model";
import { imageUploadHandler } from './functions';
import { ReadBarrioInput } from '../../schema/barrio/barrio.schema';

export class AdminService {
  static uploadImage = async (file: any): Promise<boolean> => imageUploadHandler(file);
  
  
}
