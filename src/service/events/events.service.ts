import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { EventDocument } from "../../models/event.model";
import { getListHandler, getByIdHandler } from './functions';

export class EventsService {

  static getList = async (): Promise<ScanResponse<EventDocument> | null> => getListHandler();

  static getById = async (
    eventId: EventDocument["eventId"]
  ): Promise<EventDocument | null> => getByIdHandler(eventId);
}
