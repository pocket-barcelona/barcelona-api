import type { UserDocument } from '../../models/auth/user.model.js';
import type { MeetupDocument } from '../../models/meetup.model.js';
import type { MeetupRsvpModel } from '../../models/rsvp.model.js';
import type { CreateRsvpInput, UpdateRsvpInput } from '../../schema/meetup/rsvp.schema.js';
import {
	createRsvpHandler,
	hasRsvpdToMeetupYetHandler,
	notifyMeetupHostHandler,
	updateRsvpHandler,
} from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class RsvpService {
	static createRsvp = async (
		theMeetup: MeetupDocument,
		input: CreateRsvpInput,
		userId: string
	): Promise<MeetupRsvpModel | null> => createRsvpHandler(theMeetup, input, userId);

	static updateResponse = async (
		theMeetup: MeetupDocument,
		input: UpdateRsvpInput,
		userId: string
	): Promise<MeetupRsvpModel | null> => updateRsvpHandler(theMeetup, input, userId);

	static hasRsvpdToMeetupYet = async (
		theMeetup: MeetupDocument,
		userId: UserDocument['userId'],
		rsvpId: MeetupRsvpModel['rsvpId']
	): Promise<MeetupRsvpModel['rsvpId']> => hasRsvpdToMeetupYetHandler(theMeetup, userId, rsvpId);

	static notifyMeetupHost = async (
		theMeetup: MeetupDocument,
		data: {
			name: string;
			response: string;
			comment: string;
			hostEmail: string;
		}
	): Promise<{
		success: boolean;
		error: string;
	}> => notifyMeetupHostHandler(theMeetup, data);
}
