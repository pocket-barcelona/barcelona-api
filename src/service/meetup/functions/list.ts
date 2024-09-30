
import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import MeetupModel, { type MeetupDocument, MeetupStatusEnum } from "../../../models/meetup.model";


export default async function getList(
  hostId: MeetupDocument["hostId"]
): Promise<ScanResponse<MeetupDocument> | null> {
  const metricsLabels = {
    operation: "getList",
  };

  // const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const statusField: keyof MeetupDocument = "status";
    const hostIdField: keyof MeetupDocument = "hostId";
    // const result = MeetupModel.query()
    // .where(statusField)
    // .eq(MeetupStatusEnum.Active)
    // .limit(1000)
    // .exec()
    // .catch((err: any) => {
    //   return null;
    // })

    // return await result

    // timer({ ...metricsLabels, success: "true" });
    const result = MeetupModel.scan()
      // only show my documents
      .where(hostIdField)
      .eq(hostId)
      .and()
      .where(statusField)
      // .eq(MeetupStatusEnum.Active)
      .in([MeetupStatusEnum.Published, MeetupStatusEnum.Draft])

      .exec(); // this will scan every record!
    return await result.catch((err) => {
      // logger.warn(err);
      return null;
    });
  } catch (e) {
    // timer({ ...metricsLabels, success: "false" });
    return null;
  }
}
