import type { Request, Response } from 'express';
import type { CreateRsvpInput, UpdateRsvpInput } from '../../schema/meetup/rsvp.schema.js';
import { createRsvp, hasRsvpdToMeetupAlready, updateRsvp } from './handlers/rsvp/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: TODO
export class RsvpController {
	static createRsvpHandler = (
		req: Request<CreateRsvpInput['params'], unknown, CreateRsvpInput['body']>, // the event already exists, so we need the ID from the request
		res: Response
	) => createRsvp(req, res);

	static hasRsvpdToMeetupAlreadyHandler = (
		req: Request<
			CreateRsvpInput['params'],
			unknown,
			{
				rsvpId: string;
			}
		>,
		res: Response
	) => hasRsvpdToMeetupAlready(req, res);

	static updateRsvpHandler = (
		req: Request<UpdateRsvpInput['params'], unknown, CreateRsvpInput['body']>, // the event already exists, so we need the ID from the request
		res: Response
	) => updateRsvp(req, res);
}
