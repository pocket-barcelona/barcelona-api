import BarrioModel, { BarrioDocument } from "../../../models/barrio.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { ReadBarrioInput } from '../../../schema/barrio/barrio.schema';

/**
 * Get a list of barrios - top-level or by barrio parent ID
 * @returns
 */
export default async function (
  queryParams?: ReadBarrioInput['query']
): Promise<ScanResponse<BarrioDocument> | null> {
  try {
    const parentIdField: keyof BarrioDocument = "parentId";

    const documents = BarrioModel.scan();

    if (queryParams && queryParams.regionId) {
      
      const parentId = Number(queryParams.regionId);
      documents.where(parentIdField).eq(parentId)
      
    } else {
      documents.where(parentIdField).not().eq(0)
    }
    
    const result = documents.exec(); // this will scan every record
    
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
