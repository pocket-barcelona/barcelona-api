import { Request, Response } from "express";
import { FilterByPoiInput } from "../../schema/poi/poi.schema";
import { getList } from './handlers';

export class PoiController {

  static getListHandler = (req: Request<FilterByPoiInput>, res: Response) => getList(req, res);

}
