import type { Request, Response } from "express";
import { getById, getList } from './handlers';
import type { ReadEventInput } from '../../schema/event/event.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventsController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadEventInput['params']>, res: Response) => getById(req, res);
}
