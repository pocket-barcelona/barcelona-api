import type { Request, Response } from 'express';
import type { FilterByPoiInput } from '../../schema/poi/poi.schema.js';
import { getList, getTags } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PoiController {
	static getListHandler = (
		req: Request<unknown, unknown, unknown, FilterByPoiInput>,
		res: Response
	) => getList(req, res);

	static getTagListHandler = (req: Request, res: Response) => getTags(req, res);
}
