import type { CalendarEvent } from '../../models/calendar.type.js';
import { getByIdHandler, getListHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class CalendarService {
	static getHeadlessList = async (): Promise<CalendarEvent[] | null> => getListHandler();

	static getByHeadlessId = async (id: CalendarEvent['id']): Promise<CalendarEvent | null> =>
		getByIdHandler(id);
}
