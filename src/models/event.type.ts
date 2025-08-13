import type { EventInput } from './event.model.js';

/** For parsing event data from CSV file */
export type EventCsvFile = {
	id: string;
	uuid: string;
	date_start: string;
	date_end: string;
	event_type: string;
	event_active: string;
	event_recurs: string;
	recurrence_rule: string;
	event_name: string;
	slug: string;
	location: string;
	lat: string;
	lng: string;
	location_accuracy: string;
	is_in_barcelona: string;
	url: string;
	event_notes: string;
};

export function mapCsvToEventInput(record: EventCsvFile): EventInput {
	return {
		eventId: record.id,
		uuid: record.uuid,
		dateStart: new Date(record.date_start),
		dateEnd: new Date(record.date_end),
		eventType: record.event_type,
		eventRecurs: record.event_recurs.toLowerCase() === 'true',
		eventName: record.event_name,
		slug: record.slug,
		location: record.location,
		lat: Number.parseFloat(record.lat),
		lng: Number.parseFloat(record.lng),
		locationAccuracy: Number.parseInt(record.location_accuracy) as 1 | 2 | 3,
		isInBarcelona: record.is_in_barcelona.toLowerCase() === 'true',
		url: record.url,
		eventNotes: record.event_notes,
		eventActive: record.event_active.toLowerCase() === 'true',
		recurrenceRule: record.recurrence_rule,
	};
}
