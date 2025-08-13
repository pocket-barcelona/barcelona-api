import type { EventDocument } from '../../models/event.model.js';
import { getByIdHandler, getListHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class EventsService {
	static getList = async (): Promise<EventDocument[] | null> => getListHandler();

	static getById = async (eventId: EventDocument['eventId']): Promise<EventDocument | null> =>
		getByIdHandler(eventId);
}
