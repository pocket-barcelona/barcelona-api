import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import type { PoiDocument } from '../../models/poi.model.js';
import type { FilterByPoiInput } from '../../schema/poi/poi.schema.js';
import { getListHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PoiService {
	static getList = async (
		filters: FilterByPoiInput['body']
	): Promise<ScanResponse<PoiDocument> | null> => getListHandler(filters);
}
