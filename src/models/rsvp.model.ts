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

// export type User = {
//   /** User UUID */
//   id: string;
//   /**
//    * 1=User is active, 2=limited, 3=baned.
//    * If 2: user cannot join an event by RSVP-ing
//    * If 3: user cannot login at all
//    */
//   userStatus: 1 | 2 | 3;
//   /** What they used to auth/login with */
//   authMethod: "FB" | "IG" | "GOOGLE" | "EMAIL";
//   /** The external auth token of their auth session */
//   authToken: string;
//   /** UTC of when user signed up */
//   signupDate: string;
//   /** UTC of user's last logged-in time */
//   lastLogin: string;
//   /** For resetting password via email */
//   passwordResetToken?: string;
//   /** If the user is a verified user (requires an admin to set) */
//   isVerified?: boolean;
//   /** User's firstname */
//   firstname: string;
//   /** User's lastname */
//   lastname: string;
//   /** User's email */
//   email: string;
//   /** Telegram username, without the @ */
//   telegram?: string;
//   /** User's nickname */
//   nickname?: string;
//   /** User phone number - will also work on WhatsApp */
//   mobile: string;
//   /** User's identity document */
//   identity?: {
//     /** User's DNI or NIE/TIE or Passport number */
//     documentNumber: string;
//     /** The type of document for the document number */
//     documentType: "DNI" | "TIE" | "PASSPORT" | "OTHER";
//   };
//   /** Allows users to have credit to spend on going to paid events */
//   credit: number;
//   /** User's role */
//   role: MeetupUserRole;
//   /** Profile info about the user - will be HTML */
//   about: string;
//   /** User's current location city in Spain. Ex: Barcelona */
//   currentLocation: string;
//   /** ID of the neighbourhood */
//   barrioId: number;
//   /** UTC of the time that the user arrived in BCN */
//   arrivedInBarcelona: string;
//   /** User's profile pic */
//   profilePhoto: GenericMediaItem[];
//   /** List of tag-like interests that the user has, like hiking, photography, cycling, food etc */
//   interests: string[];
//   /** Number of RSVPs that the user has done up to now */
//   completedRSVPs: number;
//   /** List of Group IDs that the user is following */
//   followingGroupIds: string[];

//   utmSource?: string;
//   utmMedium?: string;
//   utmCampaign?: string;
//   avatarColor?: string;
// };

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
