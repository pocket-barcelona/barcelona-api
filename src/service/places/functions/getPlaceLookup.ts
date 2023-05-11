import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
const DOCUMENT_SCAN_LIMIT = 1000;

type FilterFields =
  | "active";
type FilterFieldsType = keyof Pick<PlaceDocument, FilterFields>;

const fields: Record<FilterFieldsType, FilterFieldsType> = {
  active: "active",
};

/**
 * Get a simple list of places for Dashboard
 * @returns
 */
export default async function (): Promise<ScanResponse<PlaceDocument> | null> {
  try {
    let documents: Scan<PlaceDocument>;

    documents = PlaceModel.scan()
      .where(fields.active)
      .eq(true);

    return await documents
      .limit(DOCUMENT_SCAN_LIMIT)
      .exec()
      .catch(() => {
        // logger.warn(err)
        return null;
      });
  } catch (e) {
    return null;
  }
}
