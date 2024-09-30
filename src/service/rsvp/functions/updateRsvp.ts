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
  const response = theEventJson.responses.find(r => r.responseId === responseId)
  const existingResponseIndex = theEventJson.responses.findIndex(r => r.responseId === responseId)
  const isUpdating = existingResponseIndex > -1;
  
  if (!response || !isUpdating) {
    // no response ID found
    return null;
  }
  
  const newResponse: MeetupDocument['responses'][0] = {
    attendanceStatus: input.body.attendanceStatus,
    attendeeName: input.body.attendeeName,
    attendeeAvatarColor: response.attendeeAvatarColor,
    comment: input.body.comment,
    attendeeUserId: userId,
    responseId,
  }
  
  // update the response
  theEvent.responses[existingResponseIndex] = newResponse;
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