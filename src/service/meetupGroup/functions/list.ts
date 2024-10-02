import type { ScanResponse } from "dynamoose/dist/ItemRetriever";
import type { MeetupGroupDocument } from "../../../models/meetupGroup.model";
import MeetupGroupModel from "../../../models/meetupGroup.model";

export default async function getList(
  groupId?: MeetupGroupDocument["groupId"]
): Promise<ScanResponse<MeetupGroupDocument> | null> {
  try {
    // const statusField: keyof MeetupGroupDocument = "status";
    const groupIdField: keyof MeetupGroupDocument = "groupId";

    const result = MeetupGroupModel.scan()
      .where(groupIdField)
      .eq(groupId)
      // .and()
      // .where(statusField)
      // .eq(MeetupStatusEnum.Active)
      // .in([MeetupGroupStatusEnum.Published, MeetupStatusEnum.Draft])

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
