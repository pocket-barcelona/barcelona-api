import CategoryModel, { CategoryDocument } from '../../../models/category.model';
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";

/**
 * Get a list of place categories (for Legacy pocketbarcelona.com)
 * @returns
 */
export default async function (
  
): Promise<ScanResponse<CategoryDocument> | null> {
  try {
    // const activeField: keyof CategoryDocument = "active";

    const result = CategoryModel.scan()
      // only fetch my events
    //   .where(activeField)
    //   .eq(true)
      .exec(); // this will scan every record
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
