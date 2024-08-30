import type { Request, Response } from "express";
import { getById, getList } from './handlers';
import type { ReadEventInput } from '../../schema/event/event.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventsController {

  /** Get a list of events from Dynamo DB */
  static getListHandler = (req: Request, res: Response) => getList(req, res);

  /** Get an event by ID from Dynamo DB */
  static getByIdHandler = (req: Request<ReadEventInput['params']>, res: Response) => getById(req, res);
}
