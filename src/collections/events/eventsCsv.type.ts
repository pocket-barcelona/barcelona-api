export type EventsCsv = {
	id: string;
	uuid: string;
	data_start: string;
	date_end: string;
	event_type: string;
	event_active: string;
	event_recurs: boolean;
	recurrence_rule: string;
	event_name: string;
	slug: string;
	location: string;
	lat: number;
	lng: number;
	location_accuracy: 1 | 2 | 3;
	is_in_barcelona: boolean;
	url: string;
	event_notes: string;
};
