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

/** The model for users giving a response to herd events */
export interface MeetupRsvpModel {
  /** The rsvp ID - needed for updating */
  responseId: string;
  /** The event ID to which this response is related */
  // eventId: string;
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
