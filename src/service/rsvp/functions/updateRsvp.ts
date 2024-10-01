import type { MeetupRsvpModel } from "../../../models/rsvp.model";
import type { MeetupDocument } from "../../../models/meetup.model";
import type { UpdateRsvpInput } from "../../../schema/meetup/rsvp.schema";

export default async function updateResponse(theEvent: MeetupDocument, input: UpdateRsvpInput, userId: string): Promise<MeetupRsvpModel | null> {
  // add (or update) the event response into the list
  const theEventJson = theEvent.toJSON() as MeetupDocument
  
  const { responseId, eventId } = input.params;

  if (!responseId || !eventId) {
    return null;
  }

  // find the specific response ID
  const response = theEventJson.rsvps.find(r => r.rsvpId === responseId)
  const existingResponseIndex = theEventJson.rsvps.findIndex(r => r.rsvpId === responseId)
  const isUpdating = existingResponseIndex > -1;
  
  if (!response || !isUpdating) {
    // no response ID found
    return null;
  }
  
  const newResponse: MeetupDocument['rsvps'][0] = {
    attendanceStatus: input.body.attendanceStatus,
    attendeeName: input.body.attendeeName,
    attendeeAvatarColor: response.attendeeAvatarColor,
    comment: input.body.comment,
    attendeeUserId: userId,
    rsvpId: responseId,
  }
  
  // update the response
  theEvent.rsvps[existingResponseIndex] = newResponse;
  // upsertedResponse = await EventService.updateEventResponse(theEvent)
  let updated = null;

  try {
    updated = await theEvent.save()
    .catch(err => {
      // logger.warn(err);
      return null
    })
  } catch (error) {
    return null
  }
  return newResponse
}