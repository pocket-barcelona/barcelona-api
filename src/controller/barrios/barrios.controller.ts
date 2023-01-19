import { Request, Response } from "express";
import { getRegionsList, getList } from './handlers';
import { ReadBarrioInput } from '../../schema/barrio/barrio.schema';

export class BarriosController {
  static getRegionsListHandler = (req: Request, res: Response) => getRegionsList(req, res);
  static getListHandler = (req: Request<ReadBarrioInput>, res: Response) => getList(req, res);

}
