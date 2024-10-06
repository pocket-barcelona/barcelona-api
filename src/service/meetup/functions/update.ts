import MeetupModel, { type MeetupDocument, type MeetupItem } from "../../../models/meetup.model";
import type { UpdateMeetupInput } from "../../../schema/meetup/meetup.schema";

/**
 * Update a meetup
 * @param input
 * @returns The updated meetup
 */
export default async function updateMeetup(meetupId: MeetupItem["meetupId"], input: UpdateMeetupInput["body"]): Promise<MeetupDocument | null> {
  try {
    const payload = {
      input,
      meetupId,
    } as unknown as MeetupDocument;
    return await MeetupModel.update(payload).catch((err) => {
      console.log(err);
      return null;
    });
  } catch (error) {
    return null;
  }
}
