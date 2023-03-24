import EventModel, { EventDocument } from "../../../models/event.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import logger from "../../../utils/logger";

type AnyDocument = any;
/**
 * Get a specific guide
 * @returns
 */
export default async function (): Promise<ScanResponse<AnyDocument> | null> {
  return null;
}
