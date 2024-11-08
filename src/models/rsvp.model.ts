import dynamoose from "dynamoose";
import type { UserDocument } from './auth/user.model';

export enum MeetupRsvpAttendanceStatusEnum {
  Coming = 1,
  Maybe = 2,
  Cannot = 3,
  // Other = 4,
}
export const getAttendanceStatusHumanMessage = (
  status: MeetupRsvpAttendanceStatusEnum
): string => {
  switch (status) {
    case MeetupRsvpAttendanceStatusEnum.Coming:
      return `I'm in`;
    case MeetupRsvpAttendanceStatusEnum.Maybe:
      return "Maybe";
    case MeetupRsvpAttendanceStatusEnum.Cannot:
      return `Can't go`;
    default:
      return "";
  }
};

// RSVP-ING
type UserRsvpInfo = Pick<
  UserDocument,
  "nickname" | "email" | "telegram" | "firstname" | "lastname" | "mobile"
>;

type MeetupRsvpResponseType = 'YES' | 'NO' | 'MAYBE';

type RsvpType = {
  /** UUID of the RSVP response */
  responseId: string;
  /** User UUID who responded */
  userId: UserDocument["userId"];
  /** The response given by the user - if they are going or not! */
  response: MeetupRsvpResponseType;
  /** Timestamp of initial RSVP */
  responseTimestamp: string;
  /** Timestamp of updated RSVP when most recently changed */
  responseTimestampUpdated: string;
  /** Incremental number of times the user has edited their RSVP */
  changedTimes: number;
}
/** Type for people responding to meetup events */
export type MeetupRsvpResponse =
  /** Even though the user data can be looked up from the userID, this is what they share with the event in question */
  | Partial<UserRsvpInfo>
  /** Internal response mandatory data */
  | RsvpType;

export type MeetupUserRole = "ADMIN" | "HOST" | "COHOST" | "USER";


/** The model for users giving an rsvp to meetups */
export interface MeetupRsvpModel {
  /** The rsvp ID - needed for updating */
  rsvpId: string;
  /** The attendee user ID, or empty string. If empty string, the response is considered anonymous */
  attendeeUserId: string;
  /** The response (coming, maybe, not) given by the attendee */
  attendanceStatus: MeetupRsvpAttendanceStatusEnum;
  /** This can be used if given as the name, instead of the user's name */
  attendeeName: string;
  /** Their personal message, comment or request */
  attendeeAvatarColor: string;
  /** Their chosen avatar color in css format, eg. #ffee00 */
  comment: string;
  /** The timestamp of the RSVP - for ordering signups */
  rsvpTimestamp: number;
  /** The timestamp of the earlybird signup, for ordering people */
  rsvpType: TicketTypeEnum;
}

/** Note: Needs to support Bitwise, so binary values
 * More types: https://www.eventbrite.com/blog/types-event-tickets-ds00/
 */
export enum TicketTypeEnum {
  WaitingList = 1,
  PreSale = 2,
  SuperEarlyBird = 4,
  EarlyBird = 8,
  Standard = 16, // general admission
  VIP = 32,
  SingleDayPass = 64,
  MultiDayPass = 128,
  GroupPass = 256,
  MemberOnlyTickets = 512,
  EntranceOnly = 1024,
}


export const rsvpSchema = new dynamoose.Schema({
  rsvpId: {
    type: String,
    required: true,
  },
  attendeeUserId: {
    type: String,
    required: true,
  },
  attendanceStatus: {
    type: Number,
    required: true,
  },
  attendeeName: {
    type: String,
    required: true,
  },
  attendeeAvatarColor: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});
