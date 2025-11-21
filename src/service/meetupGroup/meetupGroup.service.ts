import create from './functions/create.js';
import getById from './functions/getById.js';
import getMeetupGroups from './functions/list.js';
import update from './functions/update.js';

export default {
	create,
	getMeetupGroups,
	getById,
	update,
	// deleteById,

	// deleteById = async (
	//   theEvent: MeetupGroupDocument,
	//   newStatus: MeetupGroupStatusEnum
	// ): Promise<string | null | undefined> =>
	//   deleteByIdHandler(theEvent, newStatus);
};
