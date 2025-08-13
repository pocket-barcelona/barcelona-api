import EventModel, { type EventDocument } from '../../../models/event.model.js';

/**
 * Get an event by ID
 * @returns
 */
export default async function (eventId: EventDocument['eventId']): Promise<EventDocument | null> {
	try {
		// const activeField: keyof EventDocument = "active";
		const result = EventModel.get(eventId);

		return await result.catch((err) => {
			// logger.warn(err)
			return null;
		});
	} catch (e) {
		return null;
	}
}
