import { object, string, type TypeOf } from 'zod';

const payload = {
	body: object({
		// not needed at the moment...
	}),
};

const params = {
	params: object({
		eventId: string({
			required_error: 'ID is required',
			// invalid_type_error
		}),
	}),
};

export const createEventSchema = object({
	...payload,
});

export const readEventSchema = object({
	...params,
});

export const updateEventSchema = object({
	...payload,
	...params,
});

export const deleteEventSchema = object({
	...params,
});

export type CreateEventInput = TypeOf<typeof createEventSchema>;
export type ReadEventInput = TypeOf<typeof readEventSchema>;
export type UpdateEventInput = TypeOf<typeof updateEventSchema>;
export type DeleteEventInput = TypeOf<typeof deleteEventSchema>;
