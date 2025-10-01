import EventModel, { type EventDocument } from '../../../models/event.model.js';
import { buildGoogleMapsLocationString } from '../../../utils/globalUtils.js';
import logger from '../../../utils/logger.js';

/**
 * Get a list of current events
 * @returns
 */
export default async function (): Promise<EventDocument[] | null> {
	// the app needs a list of events happening now, ignoring any past events
	// include events which have already started
	// ignore eventd which are hidden

	try {
		const activeField: keyof EventDocument = 'eventActive';

		const query = EventModel.scan().where(activeField).eq(true);
		// result.where(start).gt(yesterdayIsh);
		const res = query.exec(); // this will scan every record
		return await res
			.catch((err) => {
				logger.warn(err);
				return null;
			})
			.then((data) => {
				if (!data) return null;
				return data
					.filter(filterOldEvents)
					.sort(sortByDate)
					.map((event) => {
						return {
							...event,
							locationMaps: buildGoogleMapsLocationString({
								lat: event.lat,
								lng: event.lng,
							}),
						} as EventDocument;
					});
			});
	} catch (_e) {
		return null;
	}
}

const filterOldEvents = (item: EventDocument) => {
	const today = new Date();
	const oneDayMs = 60 * 60 * 24 * 1000;
	const yesterdayIsh = new Date(today.getTime() - oneDayMs);
	// TODO: ignore anything more than 6 months in advance
	// ignore anything in the past
	return (
		item.dateStart.getTime() > yesterdayIsh.getTime() ||
		item.dateEnd.getTime() > yesterdayIsh.getTime()
	);
};

const sortByDate = (a: EventDocument, b: EventDocument) => {
	// console.log(typeof a.dateStart, typeof b.dateStart);
	if (a.dateStart < b.dateStart) return -1;
	if (a.dateStart > b.dateStart) return 1;
	return 0;
};
