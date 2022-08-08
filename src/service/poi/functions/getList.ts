import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import PoiModel, { PoiDocument } from "../../../models/poi.model";
import { FilterByPoiInput } from "../../../schema/poi/poi.schema";

/**
 * Get a list of poi's
 * @returns
 */
export default async function (
  filters: FilterByPoiInput
): Promise<ScanResponse<PoiDocument> | null> {
  try {
    const activeField: keyof PoiDocument = "active";

    // @todo - check location
    // filters.params.lat
    
    const result = PoiModel.scan()
      // only fetch my events
      .where(activeField)
      .eq(true)
      .exec(); // this will scan every record
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
