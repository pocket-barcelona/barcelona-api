import dynamoose from 'dynamoose';
import type { UserDocument } from './auth/user.model.js';
import type { TicketTypeEnum } from './meetup.model.js';

export enum MeetupRsvpAttendanceStatusEnum {
	Coming = 1,
	Maybe = 2,
	Cannot = 3,
	// Other = 4,
}
export const getAttendanceStatusHumanMessage = (status: MeetupRsvpAttendanceStatusEnum): string => {
	switch (status) {
		case MeetupRsvpAttendanceStatusEnum.Coming:
			return `I'm in`;
		case MeetupRsvpAttendanceStatusEnum.Maybe:
			return 'Maybe';
		case MeetupRsvpAttendanceStatusEnum.Cannot:
			return `Can't go`;
		default:
			return '';
	}
};

// RSVP-ING
// type UserRsvpInfo = Pick<
//   UserDocument,
//   "nickname" | "email" | "telegram" | "firstname" | "lastname" | "mobile"
// >;

// type MeetupRsvpResponseType = 'YES' | 'NO' | 'MAYBE';

// type RsvpType = {
//   /** UUID of the RSVP response */
//   responseId: string;
//   /** User UUID who responded */
//   userId: UserDocument["userId"];
//   /** The response given by the user - if they are going or not! */
//   response: MeetupRsvpResponseType;
//   /** Timestamp of initial RSVP */
//   responseTimestamp: string;
//   /** Timestamp of updated RSVP when most recently changed */
//   responseTimestampUpdated: string;
//   /** Incremental number of times the user has edited their RSVP */
//   changedTimes: number;
// }
/** Type for people responding to meetup events */
// export type MeetupRsvpResponse =
//   /** Even though the user data can be looked up from the userID, this is what they share with the event in question */
//   | Partial<UserRsvpInfo>
//   /** Internal response mandatory data */
//   | RsvpType;

export type MeetupUserRole = 'ADMIN' | 'HOST' | 'COHOST' | 'USER';

/** The model for users giving an rsvp to meetups */
export interface MeetupRsvpModel {
	/** The rsvp ID - needed for updating */
	rsvpId: string;
	/** The attendee user ID, or empty string. If empty string, the response is considered anonymous */
	userId: string;
	/** The response (coming, maybe, not) given by the attendee */
	response: MeetupRsvpAttendanceStatusEnum;
	/** The timestamp of the initial RSVP - for ordering signups */
	rsvpTimestampInitial: number;
	/** Timestamp of when the RSVP was updated - the most recent change */
	rsvpTimestampUpdated: number;
	/** Incremental number of times the user has edited their RSVP */
	changedTimes: number;
	/** This can be used if given as the name, instead of the user's name */
	name: string;
	/** Last name, if provided in payload, not from the user */
	lastname: string;
	/** Their chosen avatar */
	avatar: string;
	/** Guest mobile number - if provided */
	mobile: string;
	/** Personal message from the guest, if provided */
	comment: string;
}

export const rsvpSchema = new dynamoose.Schema({
	rsvpId: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	response: {
		type: Number,
		required: true,
	},
	rsvpTimestampInitial: {
		type: Number,
		required: true,
	},
	rsvpTimestampUpdated: {
		type: Number,
		required: true,
	},
	changedTimes: {
		type: Number,
		required: true,
	},

	name: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
		required: true,
	},
	mobile: {
		type: String,
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
});
