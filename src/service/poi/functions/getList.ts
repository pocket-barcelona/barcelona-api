// import { Condition } from 'dynamoose/dist/Condition.js';
import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import PoiModel, { type PoiDocument } from '../../../models/poi.model.js';
import type { FilterByPoiInput } from '../../../schema/poi/poi.schema.js';
import logger from '../../../utils/logger.js';

/**
 * Get a list of poi's
 * @returns
 */
export default async function (
	filters: FilterByPoiInput['body']
): Promise<ScanResponse<PoiDocument> | null> {
	try {
		const activeField: keyof PoiDocument = 'active';
		const statusField: keyof PoiDocument = 'status';
		const barrioIdField: keyof PoiDocument = 'barrioId';
		// const latField: keyof PoiDocument = 'lat';
		// const lngField: keyof PoiDocument = 'lng';
		// const tagField: keyof PoiDocument = 'tags';

		const barrioIds = filters.barrioId
			.filter((b) => !!b)
			.map(Number)
			.slice(0, 10); // max 10?

		// @todo - check location
		// filters.lat

		const documents = PoiModel.scan()
			// only fetch my events
			.where(activeField)
			.eq(true)
			.and()
			.where(statusField)
			.eq('OPERATIONAL')
			.and()
			.where(barrioIdField)
			.in(barrioIds);

		// let relatedBarrio: BarrioInput | null = null;
		// if (results.length === 0) {
		// 	const firstBarrio = input.barrioIds[0];
		// 	relatedBarrio = getStaticBarrioById(firstBarrio);
		// 	if (!relatedBarrio) {
		// 		return null;
		// 	}
		// }

		// PUT THIS ELSEWHERE?

		// let foodDrinkResults: PoiDocument[] = [];
		// if (shouldIncludeFood || shouldIncludeDrink || shouldIncludeClubs) {
		// 	const latLng = {
		// 		lat: relatedBarrio?.centre.lat ?? 41.387023, // plaza cat!
		// 		lng: relatedBarrio?.centre.lng ?? 2.170051,
		// 	};

		// 	foodDrinkResults = await helper.fetchFoodAndDrinkDocuments(theme, results, latLng);
		// }

		// apply filters - doesn't work filtering like this on DB level
		// if (filters.tagId && Array.isArray(filters.tagId) && filters.tagId.length > 0) {
		// 	documents.and().parenthesis(
		// 		new Condition()
		// 			.where(tagField)
		// 			.contains(filters.tagId[0])
		// 			.or()
		// 			.where(tagField)
		// 			.contains(filters.tagId[1])
		// 		// new Condition().where(poiLatField).between(lowerLat, upperLat).or().where(poiLngField).between(lowerLng, upperLng)
		// 	);
		// 	// documents.and().parenthesis((condition) => {
		// 	// 	(filters.tagId ?? []).forEach((tagId, index) => {
		// 	// 		if (index === 0) {
		// 	// 			condition.where(tagField).contains(tagId);
		// 	// 		} else {
		// 	// 			condition.or().where(tagField).contains(tagId);
		// 	// 		}
		// 	// 	});
		// 	// });
		// }

		const result = documents.exec(); // this will scan every record
		return await result.catch((_err: unknown) => {
			logger.warn(_err);
			return null;
		});
	} catch (_e: unknown) {
		return null;
	}
}
