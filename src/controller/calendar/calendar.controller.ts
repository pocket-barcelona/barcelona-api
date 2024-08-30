import type { Request, Response } from "express";
import {
  getById,
  getList,
  syncEvents,
  getGoogleCalendarEventsList,
  getGoogleCalendarEventById,
  getGoogleCalendarEventByIcalUid,
} from "./handlers";
import type { ReadCalendarEventInput } from "../../schema/calendar/calendar.schema";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CalendarController {
  // Directus
  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getById(req, res);

  /** Sync events from Directus to Google Calendar. @todo - skip Directus in favour of CSV. */
  static syncToGoogleCalendarHandler = (req: Request, res: Response) =>
    syncEvents(req, res);

  /** Get a list of Google Calendar events */
  static getGoogleCalendarListHandler = (req: Request, res: Response) =>
    getGoogleCalendarEventsList(req, res);

  /** Get a Google Calendar event using its primary ID */
  static getGoogleCalendarEventByIdHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getGoogleCalendarEventById(req, res);

  /** Get instances of a recurring event from Google Calendar using its primary ID */
  static getGoogleCalendarEventInstancesHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getGoogleCalendarEventById(req, res);

  /** Get an event from Google Calendar using its iCalUID */
  static getGoogleCalendarEventByIcalUidHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getGoogleCalendarEventByIcalUid(req, res);
}
