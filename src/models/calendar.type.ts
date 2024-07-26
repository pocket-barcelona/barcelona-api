import type { calendar_v3 } from "googleapis";

export type CalendarEvent = {
  /** Internal Unique ID for the event from Google Sheets. Ex: 1, 2, 3 */
  id: string;
  /** Internal unique UUID for the event from Google Sheets */
  uuid: string;
  /** Like 2024-01-14 */
  dateStart: string;
  /** The official ending date for the event. Like 2024-01-14 */
  dateEnd: string;
  /** Event type is like: Festa Major or Open Day / Weekend or Music Festival, etc */
  eventType: string;
  /** Whether or not the event recurs, e.g. next year */
  eventRecurs: boolean;
  /** The name of the event, in English */
  eventName: string;
  /** URL friendly pathname, like: `festa-major-de-sant-antoni-2022` */
  slug: string;
  /** The exact or approximate location of the event */
  location: string;
  /** Event lat */
  lat: number;
  /** Event lng */
  lng: number;
  /** 1 = Location is accurate to LAT/LNG. 2 = Location is accurate to Neighbourhood. 3 = Location is accurate to City */
  locationAccuracy: 1 | 2 | 3;
  /** True if is in BCN */
  isInBarcelona: boolean;
  /** The official website or URL for the event */
  url: string;
  /** Optional notes or remarks about the event */
  eventNotes: string;
};

export type CalendarEventDirectus = {
  id: string;
  uuid: string;
  date_start: string;
  date_end: string;
  event_type: string;
  event_recurs: boolean;
  event_name: string;
  slug: string;
  location: string;
  lat: number;
  lng: number;
  location_accuracy: 1 | 2 | 3;
  is_in_barcelona: boolean;
  url: string;
  event_notes: null | string;
};

export function mapHeadlessCalendarItem(
  item: CalendarEventDirectus
): CalendarEvent {
  return {
    id: item.id,
    uuid: item.uuid,
    dateStart: item.date_start,
    dateEnd: item.date_end,
    eventType: item.event_type,
    eventRecurs: item.event_recurs,
    eventName: item.event_name,
    slug: item.slug,
    location: item.location,
    lat: item.lat,
    lng: item.lng,
    locationAccuracy: item.location_accuracy,
    isInBarcelona: item.is_in_barcelona,
    url: item.url,
    eventNotes: item.event_notes ?? "",
  };
}

/** Convert our event structure into a Google Calendar event */
export function mapToGoogleCalendarEvent(
  item: CalendarEvent
): calendar_v3.Schema$Event {
  if (!item.uuid) {
    throw new Error("Missing internal UUID for Google Calendar event");
  }
  
  // for data logic, start times, all day events etc, see this URL:
  // https://developers.google.com/calendar/api/concepts/events-calendars#recurrence_rule
  const event: calendar_v3.Schema$Event = {
    summary: item.eventName,
    location: item.location, // @todo - does Google need this to be an actual location? Use LAT/LNG here
    description: buildCalendarDescription(item),
    start: {
      dateTime: item.dateStart, // "2024-08-15T09:00:00+02:00"
      timeZone: "Europe/Madrid",
    },
    end: {
      dateTime: item.dateEnd, // "2024-08-21T21:00:00+02:00"
      timeZone: "Europe/Madrid",
    },
    guestsCanInviteOthers: false,
    guestsCanModify: false,
    guestsCanSeeOtherGuests: false,
    creator: {
      displayName: 'Pocket Barcelona',
      email: 'info@pocketbarcelona.com',
    },
    iCalUID: item.uuid, // Tell Google to use our ID, so that we don't get an automatic one! Will be used to update against later
  };
  return event;
}


function buildCalendarDescription(event: CalendarEvent) {
  // Build this:
  // ----------------
  // Event type
  // URL (if exists)

  // Notes from sheet
  // ----------------
  let description = '';
  
  description += `Event type: ${event.eventType}`;
  if (event.url) {
    description += `\nURL: ${event.url}`;
  }
  if (event.eventNotes) {
    description += `\n\nNotes: ${event.eventNotes}`;
  }
  return description;
}
export interface DirectusResponse<T> {
  data: T;
}
