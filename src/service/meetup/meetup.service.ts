import create from './functions/create.js';
import deleteById from './functions/delete.js';
import getById from './functions/getById.js';
import getByShortId from './functions/getByShortId.js';
import listHandler from './functions/list.js';
import search from './functions/search.js';
import update from './functions/update.js';

export default {
	create,
	deleteById,
	getById,
	getByShortId,
	getMeetups: listHandler,
	search,
	update,
};
