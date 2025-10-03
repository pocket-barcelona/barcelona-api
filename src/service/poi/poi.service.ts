import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import type { PoiDocument } from '../../models/poi.model.js';
import type { FilterByPoiInput } from '../../schema/poi/poi.schema.js';
import getListHandler from './functions/getList.js';
import getTags from './functions/getTags.js';

const getList = async (
	filters: FilterByPoiInput['body']
): Promise<ScanResponse<PoiDocument> | PoiDocument[] | null> => {
	const isFilteringTags = filters.tagId && Array.isArray(filters.tagId) && filters.tagId.length > 0;

	const results = await getListHandler(filters);
	if (isFilteringTags) {
		return (results ?? []).filter((poi) => {
			let recordContainsSomeTags = false;

			for (const theTag of filters.tagId ?? []) {
				if (recordContainsSomeTags) {
					break;
				}
				if (poi.tags.includes(theTag)) {
					recordContainsSomeTags = true;
				}
			}
			return recordContainsSomeTags;
		});
	}
	return results;
};

export default {
	getList,
	// getByIdHandler,
	getTags,
};
