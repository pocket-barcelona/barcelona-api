import type { CalendarEvent } from '../../models/calendar.type';
import { getListHandler, getByIdHandler, syncEventsHandler } from './functions';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CalendarService {

  static getHeadlessList = async (): Promise<CalendarEvent[] | null> => getListHandler();

  static getByHeadlessId = async (
    calendarEventId: CalendarEvent['id']
  ): Promise<CalendarEvent | null> => getByIdHandler(calendarEventId);

  static syncEvents = async (): Promise<CalendarEvent[] | null> => syncEventsHandler();
}
