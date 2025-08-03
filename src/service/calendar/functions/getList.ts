import { config } from "../../../config";
import {
	type CalendarEvent,
	type CalendarEventDirectus,
	type DirectusResponse,
	mapHeadlessCalendarItem,
} from "../../../models/calendar.type";

/**
 * Get a list of active calendar events from Headless CMS
 */
export default async function (): Promise<CalendarEvent[] | null> {
	try {
		// fetch from Directus
		const endpoint = `${config.HEADLESS_STUB}/items/events/?offset=0&limit=200`;
		const resp = await fetch(endpoint);
		const data: DirectusResponse<CalendarEventDirectus[]> = await resp.json();
		if (data?.data) {
			return data.data
				.filter((e) => e.event_active)
				.map((i) => mapHeadlessCalendarItem(i));
		}
		return null;
	} catch (_e) {
		return null;
	}
}
