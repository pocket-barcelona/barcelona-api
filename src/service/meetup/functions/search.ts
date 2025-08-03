import type { Query } from 'dynamoose/dist/ItemRetriever';
import MeetupModel, { type MeetupDocument } from "../../../models/meetup.model";

export default async function search(
  query: Query<MeetupDocument>
  // options?: QueryOptions = { lean: true }
): Promise<Query<MeetupDocument>> {
  const metricsLabels = {
    operation: "search",
  };

  // const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = MeetupModel.query(query);
    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    // timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}
