import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";

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
      .eq(1)
      .exec(); // this will scan every record
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
