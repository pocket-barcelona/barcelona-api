import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import PlaceModel, { type PlaceDocument } from '../../../models/place.model.js';
import type { ReadPlaceInput } from '../../../schema/place/place.schema.js';

/**
 * Get a list of places related to this place ID
 * Checks if placeRelatedId is present as an exact match
 * Then checks category, location and other things
 * @returns A list of places related to this, or a pseudo list of matches
 */
export default async function (
	placeParams: ReadPlaceInput['params']
): Promise<ScanResponse<PlaceDocument> | null> {
	try {
		const placeId = Number(placeParams.placeId);
		const activeField: keyof PlaceDocument = 'active';
		const categoryField: keyof PlaceDocument = 'categoryId';
		const placeIdField: keyof PlaceDocument = 'placeId';

		const result = await PlaceModel.get(placeId);
		// check for place related ID
		if (result.relatedPlaceId) {
			// get this place and put it first in the results
		}
		// now get a list of other related places

		// for now, just get up to 10 places

		// @todo - if the place is in barcelona, keep the related one's also in BCN

		const results = PlaceModel.scan()
			.where(activeField)
			.eq(true)
			.and()
			.where(categoryField)
			.eq(result.categoryId)
			.and()
			.where(placeIdField)
			.not()
			.eq(placeId)
			.exec();

		return await results.catch((err) => {
			// logger.warn(err)
			return null;
		});
	} catch (e) {
		return null;
	}
}
