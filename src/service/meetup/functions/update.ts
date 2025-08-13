import MeetupModel, { type MeetupDocument, type MeetupItem } from '../../../models/meetup.model.js';
import type { UpdateMeetupInput } from '../../../schema/meetup/meetup.schema.js';

/**
 * Update a meetup
 * @param input
 * @returns The updated meetup
 */
export default async function updateMeetup(
	meetupId: MeetupItem['meetupId'],
	input: UpdateMeetupInput['body']
): Promise<MeetupDocument | null> {
	try {
		// remove groupId from input
		const { groupId, ...restInput } = input;

		const payload = {
			input: restInput,
			meetupId,
		};
		const updatedDocument = await MeetupModel.update(payload).catch((err) => {
			console.log(err);
			return null;
		});
		return updatedDocument;
	} catch (error) {
		console.log({ error });
		return null;
	}
}
