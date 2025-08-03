import type {
  MeetupGroupDocument,
  MeetupGroupItem,
} from "../../../models/meetupGroup.model";
import MeetupGroupModel from "../../../models/meetupGroup.model";
import type { UpdateMeetupGroupInput } from "../../../schema/meetupGroup/meetupGroup.schema";

export default async function updateGroup(
  groupId: MeetupGroupItem["groupId"],
  input: UpdateMeetupGroupInput["body"]
): Promise<MeetupGroupDocument | null> {
  try {
    const payload: Partial<MeetupGroupDocument> = {
      ...input,
      groupId,
    };
    return await MeetupGroupModel.update(payload).catch((err: unknown) => {
      // logger.warn(err);
      return null;
    });
  } catch (error) {
    // logger.warn(error);
    return null;
  }
}
