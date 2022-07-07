import EventModel, { EventDocument } from "../../../models/event.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import logger from "../../../utils/logger";

/**
 * Get a list of events
 * @returns
 */
export default async function (): Promise<ScanResponse<EventDocument> | null> {
  try {
    
    const result = EventModel.scan()
      .exec(); // this will scan every record
    return await result
    .catch((err) => {
      logger.warn(err)
      return null;
    }).then(data => {
      if (!data) return null;
      return data?.sort((a, b) => {
        if (a.dateStart < b.dateStart) return -1;
        if (a.dateStart > b.dateStart) return 1;
        return 0;
      });
    });
  } catch (e) {
    return null;
  }
}
