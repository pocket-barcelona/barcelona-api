import {
  mapHeadlessCalendarItem,
  type CalendarEvent,
  type CalendarEventDirectus,
  type DirectusResponse,
} from "../../../models/calendar.type";
import { config } from "../../../config";

/**
 * Get a list of calendar events from Headless CMS
 */
export default async function (): Promise<CalendarEvent[] | null> {
  try {
    // fetch from Directus
    const endpoint = `${config.HEADLESS_STUB}/items/events/?offset=0&limit=200`;
    const resp = await fetch(endpoint);
    const data: DirectusResponse<CalendarEventDirectus[]> = await resp.json();
    if (data?.data) {
      return data.data.map((i) => mapHeadlessCalendarItem(i));
    }
    return null;
  } catch (e) {
    return null;
  }
}
