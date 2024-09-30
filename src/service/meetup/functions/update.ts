import MeetupModel, { type MeetupDocument, type MeetupInput } from "../../../models/meetup.model";
import type { UpdateMeetupInput } from "../../../schema/meetup/meetup.schema";

const getPollQuestions = async (eventId: MeetupInput["id"], input: UpdateMeetupInput["body"]) => {
  if (input.pollQuestions) {
    const event = await MeetupModel.get({
      id: eventId
    });

    return input.pollQuestions.map((pollQuestion) => ({
      ...pollQuestion,
      answers: event.pollQuestions.find(eventPollQuestion => eventPollQuestion.id === pollQuestion.id)?.answers ?? [],
    }));
  }
  return [];
}

/**
 * Update an event
 * @param input
 * @returns The updated event
 */
export default async function updateEven(eventId: MeetupInput["id"], input: UpdateMeetupInput["body"]): Promise<MeetupDocument | null> {
  try {
    const payload: Partial<MeetupDocument> = {
      // ...input, - HERE we need payload to be explicitly defined, or somehow we need to get createdAt and updatedAt out out input parameter.
      // feel free to tweak this part :) but the key is to not be sending timestamps here
      id: eventId,
      activityDescription: input.activityDescription,
      dateDescription: input.dateDescription,
      location: input.location,
      notes: input.notes,
      startTime: input.startTime ? new Date(input.startTime) : new Date(0),
      endTime: input.endTime ? new Date(input.endTime) : new Date(0),
      pollQuestions: input.pollQuestions ? await getPollQuestions(eventId, input) : undefined,
    };
    return await MeetupModel.update(payload).catch((err) => {
      // logger.warn(err);
      return null;
    });
  } catch (error) {
    // logger.warn(error);
    return null;
  }
}
