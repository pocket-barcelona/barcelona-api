import type { Request, Response } from 'express';
import type { FilterByPoiInput } from '../../schema/poi/poi.schema.js';
import { getList } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PoiController {
	static getListHandler = (req: Request<FilterByPoiInput>, res: Response) => getList(req, res);
}
