import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import type { EventDocument } from "../../models/event.model";
import { getListHandler, getByIdHandler } from './functions';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class EventsService {

  static getList = async (): Promise<ScanResponse<EventDocument> | null> => getListHandler();

  static getById = async (
    eventId: EventDocument["eventId"]
  ): Promise<EventDocument | null> => getByIdHandler(eventId);
}
