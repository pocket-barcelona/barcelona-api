import EventModel, { type EventDocument } from "../../../models/event.model";
import { Query, type ScanResponse } from "dynamoose/dist/DocumentRetriever";
import logger from "../../../utils/logger";

/**
 * Get a list of current events
 * @returns
 */
export default async function (): Promise<ScanResponse<EventDocument> | null> {
  const today = new Date();
  const oneDayMs = 60 * 60 * 24 * 1000;
  const yesterdayIsh = new Date(new Date().getTime() - oneDayMs);

  try {
    const start: keyof EventDocument = 'dateStart';
    const end: keyof EventDocument = 'dateEnd';

    const query = EventModel.scan();
    // result.where(start).gt(yesterdayIsh);
    const res = query.exec(); // this will scan every record
    return await res
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
