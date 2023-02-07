import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { EventDocument } from "../../models/event.model";
import { getListHandler } from './functions';

export class EventsService {

  static getList = async (): Promise<ScanResponse<EventDocument> | null> => getListHandler();
}
