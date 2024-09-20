import type { Request, Response } from "express";
import type { FilterByPoiInput } from "../../schema/poi/poi.schema";
import { getList } from './handlers';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PoiController {

  static getListHandler = (req: Request<FilterByPoiInput>, res: Response) => getList(req, res);

}
