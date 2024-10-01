import MeetupModel, { type MeetupDocument, type MeetupItem } from "../../../models/meetup.model";
import MeetupGroupModel, { type MeetupGroupItem } from '../../../models/meetupGroup.model';

export default async function getById(
  input: Pick<MeetupItem, "meetupId"> & { loggedIn?: boolean; }
): Promise<MeetupDocument | Partial<MeetupDocument> | null> {
  const metricsLabels = {
    operation: "getById",
  };

  // const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await MeetupModel.get({
      id: input.meetupId.toString(),
    }).catch((err) => {
      // logger.warn(err);
      return null;
    });

    // const idField: keyof MeetupGroupItem = 'id';
    // const groupFound = result
    //   ? await MeetupGroupModel.scan()
    //       .where(idField)
    //       .eq(result.groupId)
    //       .exec()
    //       .catch((err: unknown) => {
    //         // logger.warn(err);
    //         return null;
    //       })
    //   : null;

    // if (result) {
    //   result.hostName = groupFound ? groupFound[0].firstname : '';
    //   result.hostAvatarColor = groupFound ? groupFound[0].avatarColor : '';
      
    //   result.pollResults = result.pollQuestions.map((question) => ({
    //     questionContent: question.content,
    //     answers: question.possibleAnswers.map((possibleAnswer) => ({
    //       answerContent: possibleAnswer.content,
    //       answerCreatedBy: result.responses.find(response => response.responseId === possibleAnswer.addedByResponseId)?.attendeeName ?? undefined,
    //       votes: question.answers
    //         .filter((answer) => (answer.answers.includes(possibleAnswer.id)))
    //         .map(answer => result.responses.find(response => response.responseId === answer.responseId))
    //         .map((response) => ({
    //           name: response?.attendeeName ?? '',
    //           avatarColor: response?.attendeeAvatarColor
    //         }))
    //     }))
    //   }));      
    // } 

    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    // timer({ ...metricsLabels, success: "false" });
    // throw e;
    return null;
  }
}
