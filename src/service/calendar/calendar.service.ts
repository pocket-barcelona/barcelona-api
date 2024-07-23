import type { CalendarEvent } from '../../models/calendar.type';
import { getListHandler, getByIdHandler } from './functions';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventsService {

  static getList = async (): Promise<CalendarEvent[] | null> => getListHandler();

  static getById = async (
    calendarEventId: CalendarEvent['id']
  ): Promise<CalendarEvent | null> => getByIdHandler(calendarEventId);
}
