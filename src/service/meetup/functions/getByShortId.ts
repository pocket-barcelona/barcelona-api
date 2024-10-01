import lodash from "lodash";
const { pick } = lodash;
import MeetupModel, {
  type MeetupDocument,
  type MeetupItem,
} from "../../../models/meetup.model";

export default async function getByShortId(
  input: Pick<MeetupItem, "shortId">
): Promise<MeetupDocument | Partial<MeetupDocument> | null> {

  try {
    const shortId = input.shortId;
    const result = await MeetupModel.scan('shortId').eq(shortId).exec().catch(() => {
      return null;
    });

    if (!result) {
      return null;
    }

    const document = result[0];
    const documentFields: Array<keyof MeetupDocument> = ['meetupId', 'shortId', 'createdAt', 'updatedAt', 'startTime', 'endTime', 'eventDesc', 'groupId', 'location', 'status'];
    return pick(document, documentFields);

  } catch (e) {
    return null;
  }
}
