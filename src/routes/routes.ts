import type { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'; // https://www.npmjs.com/package/http-status-codes
import adminRoutes from './admin.js';
import barriosRoutes from './barrios.js';
import eventsRoutes from './events.js';
import meetupRoutes from './meetup.js';
import meetupGroupRoutes from './meetupGroup.js';
import placesRoutes from './places.js';
import plannerRoutes from './planner.js';
import poiRoutes from './poi.js';
import postsRoutes from './posts.js';
import sessionRoutes from './session.js';
import usersRoutes from './users.js';

function routes(app: Express) {
	app.get('/healthcheck', (_req: Request, res: Response) => {
		res.sendStatus(StatusCodes.OK);
	});
	app.use('/api/barrios', barriosRoutes);
	app.use('/api/explore', placesRoutes);
	app.use('/api/poi', poiRoutes);
	app.use('/api/events', eventsRoutes);
	app.use('/api/meetup', meetupRoutes);
	app.use('/api/meetupGroup', meetupGroupRoutes);
	app.use('/api/planner', plannerRoutes);
	app.use('/api/posts', postsRoutes);
	// USER LOGIN/AUTH
	app.use('/api/auth/session', sessionRoutes);
	// USER CREATION, PROFILE, RESET PASSWORD etc
	app.use('/api/user', usersRoutes);
	// CMS ROUTES
	app.use('/api/admin', adminRoutes);
}

export default routes;
