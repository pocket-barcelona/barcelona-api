import { Request, Response } from "express";
import { getList } from './handlers';

export class GuideController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

}
