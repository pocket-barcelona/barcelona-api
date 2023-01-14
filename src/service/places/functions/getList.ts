import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";


const DOCUMENT_SCAN_LIMIT = 500;
const TEST_LIMIT = 10;

/**
 * Get a list of places
 * @returns
 */
export default async function (
  
): Promise<ScanResponse<PlaceDocument> | null> {
  try {
    const activeField: keyof PlaceDocument = "active";

    const result = PlaceModel.scan()
      // only fetch my events
      .where(activeField)
      .eq(true)
      // https://dynamoosejs.com/guide/Scan#scanlimitcount
      .limit(TEST_LIMIT)
      .exec(); // this will scan every record
    return await result.catch(() => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
