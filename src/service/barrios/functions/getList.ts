import BarrioModel, { BarrioDocument } from "../../../models/barrio.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";

/**
 * Get a list of barrios - top-level or by barrio parent ID
 * @returns
 */
export default async function (
  parentId?: BarrioDocument["parentId"]
): Promise<ScanResponse<BarrioDocument> | null> {
  try {
    const parentIdField: keyof BarrioDocument = "parentId";

    const result = BarrioModel.scan()
      // only fetch my events
      .where(parentIdField)
      .eq(parentId || 0)
      .exec(); // this will scan every record
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
