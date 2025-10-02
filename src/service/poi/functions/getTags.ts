import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import PoiTagModel, { type PoiTagDocument } from '../../../models/poiTag.model.js';

/**
 * Get a list of tags for poi's
 * @returns
 */
export default async function (
	// filters: FilterByPoiInput['body']
): Promise<ScanResponse<PoiTagDocument> | null> {
	try {
		const activeField: keyof PoiTagDocument = 'active';

		const documents = PoiTagModel.scan()
			// only fetch my events
			.where(activeField)
			.eq(true)
			.limit(200);

		const result = documents.exec(); // this will scan every record
		return await result.catch((_err: unknown) => {
			// logger.warn(err)
			return null;
		});
	} catch (_e: unknown) {
		return null;
	}
}
