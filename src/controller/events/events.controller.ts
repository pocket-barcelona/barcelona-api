import { Request, Response } from "express";
import { getById, getList } from './handlers';
import { ReadEventInput } from '../../schema/event/event.schema';

export class EventsController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadEventInput['params']>, res: Response) => getById(req, res);
}
