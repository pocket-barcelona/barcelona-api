import { type MeetupDocument, MeetupStatusEnum } from '../../../models/meetup.model.js';

export default async function deleteDocument(
	theItem: MeetupDocument,
	newStatus: MeetupStatusEnum
): Promise<string | null | undefined> {
	if (newStatus === MeetupStatusEnum.Deleted) {
		try {
			return await theItem.delete().catch((err) => {
				// logger.warn(err)
				if (err.message) {
					return err.message;
				}
				return 'Error: Event not deleted!';
			});
		} catch (error: unknown) {
			// logger.warn(error)
			if (error instanceof Error) {
				return error.message;
			}
			return 'Error: Event not deleted!!';
		}
	}

	try {
		theItem.status = MeetupStatusEnum.SoftDeleted;
		theItem.save().catch((err) => {
			// logger.warn(err)
			return null;
		});
	} catch (error) {
		// logger.warn(error)
		return null;
	}
}
