import type { EventResponseModel } from "../../../models/rsvp.model";
import type { MeetupDocument } from "../../../models/meetup.model";
import type { CreateResponseInput } from "../../../schema/meetup/rsvp.schema";
import { v4 as uuidv4 } from 'uuid';

export default async function createResponse(
  theEvent: MeetupDocument,
  input: CreateResponseInput,
  userId: string
): Promise<EventResponseModel | null> {
  const responseId = uuidv4();
  const newResponse: EventResponseModel = {
    responseId: responseId,
    attendanceStatus: input.body.attendanceStatus,
    attendeeName: input.body.attendeeName,
    attendeeAvatarColor: input.body.attendeeAvatarColor,
    comment: input.body.comment,
    attendeeUserId: userId,
  };

  theEvent.responses.push(newResponse);
  
  const pollAnswers = input.body.pollAnswers;
  if (pollAnswers) {
    theEvent.pollQuestions.map((question, index) => {
      const answers = input.body.pollAnswers?.find(pollAnswer => pollAnswer.questionId === question.id)?.answers;
      if (answers) {
        const possibleAnswers = theEvent.pollQuestions.find(pollQuestion => pollQuestion.id === question.id)?.possibleAnswers;

        const nonExistingAnswers = answers.filter(answer => !possibleAnswers?.filter(possibleAnswer => possibleAnswer.id === answer)?.length ?? true);
        const existingAnswers = answers.filter(answer => possibleAnswers?.filter(possibleAnswer => possibleAnswer.id === answer)?.length ?? false);
        const createdAnswers: string[] = [];

        nonExistingAnswers.forEach(nonExistingAnswer => {
          const newAnswerId = uuidv4();
          createdAnswers.push(newAnswerId);
          theEvent.pollQuestions[index].possibleAnswers.push({
            id: newAnswerId,
            addedByResponseId: responseId,
            content: nonExistingAnswer
          })
        });

        const userAnswers = {
          responseId: responseId,
          answers: existingAnswers.concat(createdAnswers)
        }
        theEvent.pollQuestions[index].answers.push(userAnswers)
      }
    })
  }

  let updated = null;

  try {
    updated = await theEvent.save().catch((err) => {
      // logger.warn(err);
      return null;
    });
  } catch (error) {
    return null;
  }
  return newResponse;
}
