import BarrioModel, { BarrioDocument } from "../../../models/barrio.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";

/**
 * Get a list of top-level barrios
 * @returns
 */
export default async function (): Promise<ScanResponse<BarrioDocument> | null> {
  try {
    const parentIdField: keyof BarrioDocument = "parentId";

    // support for top-level barrios, where parentId is undefined

    const result = BarrioModel.scan()
      .where(parentIdField)
      .eq(0)
      .exec(); // this will scan every record
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
