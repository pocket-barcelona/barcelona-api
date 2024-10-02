import MeetupGroupModel, {
  type MeetupGroupDocument,
  type MeetupGroupItem,
} from "../../../models/meetupGroup.model";

export default async function getById(
  input: Pick<MeetupGroupItem, "groupId"> & { loggedIn?: boolean }
): Promise<MeetupGroupDocument | Partial<MeetupGroupDocument> | null> {
  try {
    const result = await MeetupGroupModel.get({
      id: input.groupId.toString(),
    }).catch((err) => {
      // logger.warn(err);
      return null;
    });
    return result;
  } catch (e: unknown) {
    return null;
  }
}
