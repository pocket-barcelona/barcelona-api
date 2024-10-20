import {
  mapHeadlessCalendarItem,
  type CalendarEvent,
  type CalendarEventDirectus,
  type DirectusResponse,
} from "../../../models/calendar.type";
import { config } from "../../../config";

/**
 * Get a calendar event by ID from Headless CMS
 */
export default async function (
  id: CalendarEvent["id"]
): Promise<CalendarEvent | null> {
  try {
    // fetch from Directus
    const endpoint = `${config.HEADLESS_STUB}/items/events/${id}`;
    const resp = await fetch(endpoint);
    const data: DirectusResponse<CalendarEventDirectus> = await resp.json();
    if (data?.data) {
      return mapHeadlessCalendarItem(data.data);
    }

    return null;
  } catch (e) {
    return null;
  }
}
