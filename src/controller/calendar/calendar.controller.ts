import type { Request, Response } from "express";
import { getById, getList, syncEvents, getGoogleCalendarEventsList, getGoogleCalendarEventById, getGoogleCalendarEventByIcalUid } from './handlers';
import type { ReadCalendarEventInput } from '../../schema/calendar/calendar.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CalendarController {

  // Directus
  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadCalendarEventInput['params']>, res: Response) => getById(req, res);

  // Google Calendar
  static syncToGoogleCalendarHandler = (req: Request, res: Response) => syncEvents(req, res);

  static getGoogleCalendarListHandler = (req: Request, res: Response) => getGoogleCalendarEventsList(req, res);

  static getGoogleCalendarEventByIdHandler = (req: Request<ReadCalendarEventInput['params']>, res: Response) => getGoogleCalendarEventById(req, res);

  static getGoogleCalendarEventByIcalUidHandler = (req: Request<ReadCalendarEventInput['params']>, res: Response) => getGoogleCalendarEventByIcalUid(req, res);

}
