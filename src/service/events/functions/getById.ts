import EventModel, { type EventDocument } from '../../../models/event.model.js';
import { buildGoogleMapsLocationString } from '../../../utils/globalUtils.js';

/**
 * Get an event by ID
 * @returns
 */
export default async function (eventId: EventDocument['eventId']): Promise<EventDocument | null> {
	try {
		// const activeField: keyof EventDocument = "active";
		const result = EventModel.get(eventId);
		const data = await result.catch((_err) => {
			// logger.warn(err)
			return null;
		});
		if (!data) return null;
		return {
			...data,
			locationMaps: buildGoogleMapsLocationString({
				lat: data?.lat,
				lng: data?.lng,
			}),
		} as EventDocument;
	} catch (_e) {
		return null;
	}
}
