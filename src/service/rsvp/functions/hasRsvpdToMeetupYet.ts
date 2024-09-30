import type { MeetupRsvpModel } from "../../../models/rsvp.model";
import type { MeetupDocument } from "../../../models/meetup.model";
import type { UserDocument } from "../../../models/auth/user.model";

/**
 * Checks to see if the logged-in or anonymous user has already responded to this event yet.
 * If the user is logged-in, will check to see if the user ID is in the responses list
 * If not found, check to see if the responseId given exists in the event responses
 * @param theEvent
 * @param userId
 * @param responseId
 * @returns The response ID if exists, or an empty string
 */
export default async function hasRsvpdToMeetupYetHandler(
  theEvent: MeetupDocument,
  userId: UserDocument["userId"],
  responseId: MeetupRsvpModel["responseId"]
): Promise<MeetupRsvpModel["responseId"]> {
  if (theEvent.responses.length === 0) {
    return "";
  }

  // 1. if user ID, check event for user ID in event responses (even if response ID exists or not)
  // 2. check event for response ID (even if no user ID)

  if (userId) {
    // 1 - check for userID
    const userResponded = theEvent.responses.filter(
      (r) => r.attendeeUserId !== "" && r.attendeeUserId === userId
    );
    if (userResponded.length > 0) {
      // logged in user has already responded to this event
      return userResponded[0].responseId;
    }
  }

  if (responseId) {
    const userResponded = theEvent.responses.some(
      (r) => r.responseId === responseId
    );
    if (userResponded) {
      // logged out user has already responded to this event since they know the response ID
      return responseId;
    }
  }

  return "";
}
