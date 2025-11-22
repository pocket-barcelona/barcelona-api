import createMeetupHandler from './handlers/create.js';
import deleteMeetupHandler from './handlers/delete.js';
import getMeetupByIdHandler from './handlers/getById.js';
import getMeetupByShortIdHandler from './handlers/getByShortId.js';
import getMeetupsListHandler from './handlers/getList.js';
import updateMeetupHandler from './handlers/update.js';

export default {
	createMeetupHandler,
	getMeetupByIdHandler,
	getMeetupByShortIdHandler,
	getMeetupsListHandler,
	updateMeetupHandler,
	deleteMeetupHandler,
};
