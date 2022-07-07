import { Request, Response } from "express";
import { getList } from './handlers';

export class EventsController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

}
