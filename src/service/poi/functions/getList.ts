import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import PoiModel, { type PoiDocument } from '../../../models/poi.model.js';
import type { FilterByPoiInput } from '../../../schema/poi/poi.schema.js';

/**
 * Get a list of poi's
 * @returns
 */
export default async function (
	filters: FilterByPoiInput['body']
): Promise<ScanResponse<PoiDocument> | null> {
	try {
		const activeField: keyof PoiDocument = 'active';
		const latField: keyof PoiDocument = 'lat';
		const lngField: keyof PoiDocument = 'lng';

		// @todo - check location
		// filters.lat

		const documents = PoiModel.scan()
			// only fetch my events
			.where(activeField)
			.eq(true);

		// apply filters
		// if (filters.lat) {
		//   documents.and().where(latField).between()
		// }

		const result = documents.exec(); // this will scan every record
		return await result.catch((err) => {
			// logger.warn(err)
			return null;
		});
	} catch (e) {
		return null;
	}
}
