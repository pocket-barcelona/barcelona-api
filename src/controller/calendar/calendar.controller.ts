import type { Request, Response } from "express";
import { getById, getList, syncEvents } from './handlers';
import type { ReadCalendarEventInput } from '../../schema/calendar/calendar.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CalendarController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadCalendarEventInput['params']>, res: Response) => getById(req, res);

  static syncAllHandler = (req: Request, res: Response) => syncEvents(req, res);
}
