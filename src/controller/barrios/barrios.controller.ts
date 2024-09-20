import type { Request, Response } from "express";
import { getRegionsList, getList } from './handlers';
import type { ReadBarrioInput } from '../../schema/barrio/barrio.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BarriosController {
  static getRegionsListHandler = (req: Request, res: Response) => getRegionsList(req, res);
  static getListHandler = (req: Request<ReadBarrioInput>, res: Response) => getList(req, res);

}
