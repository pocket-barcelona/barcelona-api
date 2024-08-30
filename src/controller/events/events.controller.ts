import type { Request, Response } from "express";
import {
  getById,
  getList,
  getByIdHeadless,
  getListHeadless,
  getGoogleCalendarEventById,
  getGoogleCalendarEventByIcalUid,
  getGoogleCalendarEventInstances,
  getGoogleCalendarEventsList,
  syncEventsGoogle,
  syncEventsDynamo
} from "./handlers";
import type { ReadEventInput } from "../../schema/event/event.schema";
import type { ReadCalendarEventInput } from '../../schema/event/calendar.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventsController {
  /** Get a list of events from Dynamo DB */
  static getListHandler = (req: Request, res: Response) => getList(req, res);

  /** Get an event by ID from Dynamo DB */
  static getByIdHandler = (
    req: Request<ReadEventInput["params"]>,
    res: Response
  ) => getById(req, res);

  /** Sync events from CSV to AWS. */
  static syncToDynamoHandler = (req: Request, res: Response) =>
    syncEventsDynamo(req, res);

  /** @deprecated
   * Directus events list */
  static getListHeadlessHandler = (req: Request, res: Response) => getListHeadless(req, res);

  static getByIdHeadlessHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getByIdHeadless(req, res);

  /** Sync events from Directus to Google Calendar. @todo - skip Directus in favour of CSV. */
  static syncToGoogleCalendarHandler = (req: Request, res: Response) =>
    syncEventsGoogle(req, res);

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
  ) => getGoogleCalendarEventInstances(req, res);

  /** Get an event from Google Calendar using its iCalUID */
  static getGoogleCalendarEventByIcalUidHandler = (
    req: Request<ReadCalendarEventInput["params"]>,
    res: Response
  ) => getGoogleCalendarEventByIcalUid(req, res);
}
