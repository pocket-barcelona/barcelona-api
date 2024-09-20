import PlaceModel, { type PlaceInput, type PlaceDocument } from "../../../models/place.model";
import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';

const DOCUMENT_SCAN_LIMIT = 1000;

type FilterFields = keyof Pick<PlaceInput, 'active'>;
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
    const documents = PlaceModel.scan()
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
