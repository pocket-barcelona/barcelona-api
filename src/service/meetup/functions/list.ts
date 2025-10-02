import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import MeetupModel, {
	type MeetupDocument,
	MeetupStatusEnum,
} from '../../../models/meetup.model.js';
import logger from '../../../utils/logger.js';

export default async function getList(
	groupId: MeetupDocument['groupId']
): Promise<ScanResponse<MeetupDocument> | null> {
	try {
		const statusField: keyof MeetupDocument = 'status';
		const groupIdField: keyof MeetupDocument = 'groupId';
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
			.where(groupIdField)
			.eq(groupId)
			.and()
			.where(statusField)
			// // .eq(MeetupStatusEnum.Active)
			.in([MeetupStatusEnum.Published, MeetupStatusEnum.Provisional])
			.limit(500)
			.exec(); // this will scan every record!
		return await result.catch((err) => {
			console.log(err);
			return null;
		});
	} catch (e) {
		return null;
	}
}
