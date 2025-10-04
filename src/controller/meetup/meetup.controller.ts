import type { Request, Response } from 'express';
import type {
	CreateMeetupInput,
	DeleteMeetupInput,
	GetMeetupsInput,
	ReadMeetupByIdInput,
	ReadMeetupByShortIdInput,
	UpdateMeetupInput,
} from '../../schema/meetup/meetup.schema.js';
import {
	createMeetup,
	deleteMeetup,
	getMeetupById,
	getMeetupByShortId,
	getMeetupsList,
	updateMeetup,
} from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: WIP
export class MeetupController {
	static createMeetupHandler = (
		req: Request<unknown, unknown, CreateMeetupInput['body']>,
		res: Response
	) => createMeetup(req, res);

	static getNotLoggedInMeetupHandler = (
		req: Request<ReadMeetupByIdInput['params']>,
		res: Response
	) => getMeetupById(req, res, false); // user not logged in!

	static getMeetupHandler = (req: Request<UpdateMeetupInput['params']>, res: Response) =>
		getMeetupById(req, res); // user logged in!

	static getMeetupByShortIdHandler = (
		req: Request<ReadMeetupByShortIdInput['params']>,
		res: Response
	) => getMeetupByShortId(req, res);

	static getMeetupsListHandler = (req: Request<GetMeetupsInput['params']>, res: Response) =>
		getMeetupsList(req, res);

	static updateMeetupHandler = (
		req: Request<UpdateMeetupInput['params'], unknown, UpdateMeetupInput['body']>,
		res: Response
	) => updateMeetup(req, res);

	static deleteMeetupHandler = (
		req: Request<DeleteMeetupInput['params'], unknown, UpdateMeetupInput['body']>,
		res: Response
	) => deleteMeetup(req, res);
}
