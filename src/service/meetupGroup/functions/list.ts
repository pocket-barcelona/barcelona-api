import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import type { MeetupGroupDocument } from '../../../models/meetupGroup.model.js';
import MeetupGroupModel from '../../../models/meetupGroup.model.js';

export default async function getList(
	ownerId?: MeetupGroupDocument['ownerId']
): Promise<ScanResponse<MeetupGroupDocument> | null> {
	try {
		// const statusField: keyof MeetupGroupDocument = "status";
		const ownerIdField: keyof MeetupGroupDocument = 'ownerId';

		const result = MeetupGroupModel.scan();
		if (ownerId) {
			result.where(ownerIdField).eq(ownerId);
		}

		return result.exec(); // this will scan every record!
		// return await result.catch((err) => {
		//   // logger.warn(err);
		//   return null;
		// });
	} catch (e) {
		// timer({ ...metricsLabels, success: "false" });
		return null;
	}
}
