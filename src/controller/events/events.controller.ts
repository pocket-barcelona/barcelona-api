import getByIdHandler from './handlers/getById.js';
import getByIdHeadlessHandler from './handlers/getByIdHeadless.js';
import getGoogleCalendarEventByIcalUidHandler from './handlers/getGoogleCalendarEventByIcalUid.js';
import getGoogleCalendarEventByIdHandler from './handlers/getGoogleCalendarEventById.js';
import getGoogleCalendarEventInstancesHandler from './handlers/getGoogleCalendarEventInstances.js';
import getGoogleCalendarEventsListHandler from './handlers/getGoogleCalendarEventsList.js';
import getListHandler from './handlers/getList.js';
import getListHeadlessHandler from './handlers/getListHeadless.js';
import syncToDynamoHandler from './handlers/syncEventsDynamo.js';
import syncToGoogleCalendarHandler from './handlers/syncEventsGoogle.js';

export default {
	getListHandler,
	getByIdHandler,
	syncToDynamoHandler,
	getListHeadlessHandler,
	getByIdHeadlessHandler,
	syncToGoogleCalendarHandler,
	getGoogleCalendarEventsListHandler,
	getGoogleCalendarEventByIdHandler,
	getGoogleCalendarEventInstancesHandler,
	getGoogleCalendarEventByIcalUidHandler,
};
