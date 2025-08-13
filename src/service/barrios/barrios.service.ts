import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import type { BarrioDocument } from '../../models/barrio.model.js';
import type { ReadBarrioInput } from '../../schema/barrio/barrio.schema.js';
import { getListHandler, getRegionsListHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: TODO
export class BarriosService {
	static getRegionsList = async (): Promise<ScanResponse<BarrioDocument> | null> =>
		getRegionsListHandler();

	static getList = async (
		queryParams?: ReadBarrioInput['query']
	): Promise<ScanResponse<BarrioDocument> | null> => getListHandler(queryParams);
}
