import { Request, Response } from "express";
import { getList, getById } from './handlers';

export class GuideController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);
  
  static getByIdHandler = (req: Request, res: Response) => getById(req, res);

}
