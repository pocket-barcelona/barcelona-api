import MeetupGroupModel, {
	type MeetupGroupDocument,
	type MeetupGroupItem,
} from '../../../models/meetupGroup.model.js';
import logger from '../../../utils/logger.js';

export default async function getById(
	input: Pick<MeetupGroupItem, 'groupId'> & { loggedIn?: boolean }
): Promise<MeetupGroupDocument | Partial<MeetupGroupDocument> | null> {
	try {
		const groupId = input.groupId.toString();
		const result = await MeetupGroupModel.get({
			groupId,
		}).catch((err) => {
			logger.warn(err);
			return null;
		});
		return result;
	} catch (e: unknown) {
		logger.warn(e);
		return null;
	}
}
