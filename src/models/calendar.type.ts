import type { calendar_v3 } from 'googleapis';

export type CalendarEvent = {
	/** Internal Unique ID for the event from Google Sheets. Ex: 1, 2, 3 */
	id: string;
	/** Internal unique UUID for the event from Google Sheets */
	uuid: string;
	/** The official starting date for the event. Like 2024-01-14 */
	dateStart: string;
	/** The official ending date for the event. Like 2024-01-14 */
	dateEnd: string;
	/** Event type is like: Festa Major or Open Day / Weekend or Music Festival, etc */
	eventType: string;
	/** Enabled/disable events from being shown */
	eventActive: boolean;
	/** Whether or not the event recurs, e.g. next year. Note: this isn't accurate to the exact date next year! */
	eventRecurs: boolean;
	/** Google Calendar rule. @url https://developers.google.com/calendar/api/v3/reference/events#recurrence */
	recurrenceRule: string;
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
	event_active: boolean;
	event_recurs: boolean;
	recurrence_rule: string;
	event_name: string;
	slug: string;
	location: string;
	lat: number;
	lng: number;
	/** 1 = Location is accurate to LAT/LNG. 2 = Location is accurate to Neighbourhood. 3 = Location is accurate to City */
	location_accuracy: 1 | 2 | 3;
	is_in_barcelona: boolean;
	url: string;
	event_notes: null | string;
};

export function mapHeadlessCalendarItem(item: CalendarEventDirectus): CalendarEvent {
	return {
		id: item.id,
		uuid: item.uuid,
		dateStart: item.date_start,
		dateEnd: item.date_end,
		eventType: item.event_type,
		eventActive: item.event_active,
		eventRecurs: item.event_recurs,
		recurrenceRule: item.recurrence_rule,
		eventName: item.event_name,
		slug: item.slug,
		location: item.location,
		lat: item.lat,
		lng: item.lng,
		locationAccuracy: item.location_accuracy,
		isInBarcelona: item.is_in_barcelona,
		url: item.url,
		eventNotes: item.event_notes ?? '',
	};
}

export interface DirectusResponse<T> {
	data: T;
}
