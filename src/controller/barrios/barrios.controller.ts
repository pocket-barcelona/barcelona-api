import type { Request, Response } from 'express';
import type { ReadBarrioInput } from '../../schema/barrio/barrio.schema.js';
import { getList, getRegionsList } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BarriosController {
	static getRegionsListHandler = (req: Request, res: Response) => getRegionsList(req, res);
	static getListHandler = (req: Request<ReadBarrioInput>, res: Response) => getList(req, res);
}
