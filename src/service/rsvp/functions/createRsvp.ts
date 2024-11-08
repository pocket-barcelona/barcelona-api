import type { MeetupRsvpModel } from "../../../models/rsvp.model";
import { TicketTypeEnum, type MeetupDocument } from "../../../models/meetup.model";
import type { CreateRsvpInput } from "../../../schema/meetup/rsvp.schema";
import { v4 as uuidv4 } from 'uuid';

export default async function createRsvp(
  theEvent: MeetupDocument,
  input: CreateRsvpInput,
  userId: string
): Promise<MeetupRsvpModel | null> {
  const rsvpId = uuidv4();

  // V1 - only 1 guest is allowed - the main guest
  const theGuest = input.body.guests[0];

  const newResponse: MeetupRsvpModel = {
    rsvpId,
    response: input.body.response, // all guest share the same rsvp status
    name: theGuest.name,
    lastname: theGuest.lastname ?? '',
    mobile: theGuest.mobile ?? '',
    avatar: theGuest.avatar,
    comment: theGuest.comment ?? '',
    userId: userId,
    rsvpTimestampInitial: Date.now(),
    rsvpTimestampUpdated: Date.now(),
    changedTimes: 0,
  };

  return newResponse;

  // theEvent.rsvps.push(newResponse);
  
  // // const pollAnswers = input.body.pollAnswers;
  // // if (pollAnswers) {
  // //   theEvent.pollQuestions.map((question, index) => {
  // //     const answers = input.body.pollAnswers?.find(pollAnswer => pollAnswer.questionId === question.id)?.answers;
  // //     if (answers) {
  // //       const possibleAnswers = theEvent.pollQuestions.find(pollQuestion => pollQuestion.id === question.id)?.possibleAnswers;

  // //       const nonExistingAnswers = answers.filter(answer => !possibleAnswers?.filter(possibleAnswer => possibleAnswer.id === answer)?.length ?? true);
  // //       const existingAnswers = answers.filter(answer => possibleAnswers?.filter(possibleAnswer => possibleAnswer.id === answer)?.length ?? false);
  // //       const createdAnswers: string[] = [];

  // //       nonExistingAnswers.forEach(nonExistingAnswer => {
  // //         const newAnswerId = uuidv4();
  // //         createdAnswers.push(newAnswerId);
  // //         theEvent.pollQuestions[index].possibleAnswers.push({
  // //           id: newAnswerId,
  // //           addedByResponseId: responseId,
  // //           content: nonExistingAnswer
  // //         })
  // //       });

  // //       const userAnswers = {
  // //         responseId: responseId,
  // //         answers: existingAnswers.concat(createdAnswers)
  // //       }
  // //       theEvent.pollQuestions[index].answers.push(userAnswers)
  // //     }
  // //   })
  // // }

  // let updated = null;

  // try {
  //   updated = await theEvent.save().catch((err) => {
  //     // logger.warn(err);
  //     return null;
  //   });
  // } catch (error) {
  //   return null;
  // }
  // return newResponse;
}
