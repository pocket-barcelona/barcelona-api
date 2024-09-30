import MeetupModel, { type MeetupDocument, type MeetupInput } from "../../../models/meetup.model";
import UserModel from "../../../models/auth/user.model";

export default async function getById(
  input: Pick<MeetupInput, "id"> & { loggedIn?: boolean; }
): Promise<MeetupDocument | Partial<MeetupDocument> | null> {
  const metricsLabels = {
    operation: "getById",
  };

  // const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const result = await MeetupModel.get({
      id: input.id.toString(),
    }).catch((err) => {
      // logger.warn(err);
      return null;
    });

    const userFound = result
      ? await UserModel.scan()
          .where("userId")
          .eq(result.hostId)
          .exec()
          .catch((err: unknown) => {
            // logger.warn(err);
            return null;
          })
      : null;

    if (result) {
      result.hostName = userFound ? userFound[0].name : '';
      result.hostAvatarColor = userFound ? userFound[0].avatarColor : '';
      
      result.pollResults = result.pollQuestions.map((question) => ({
        questionContent: question.content,
        answers: question.possibleAnswers.map((possibleAnswer) => ({
          answerContent: possibleAnswer.content,
          answerCreatedBy: result.responses.find(response => response.responseId === possibleAnswer.addedByResponseId)?.attendeeName ?? undefined,
          votes: question.answers
            .filter((answer) => (answer.answers.includes(possibleAnswer.id)))
            .map(answer => result.responses.find(response => response.responseId === answer.responseId))
            .map((response) => ({
              name: response?.attendeeName ?? '',
              avatarColor: response?.attendeeAvatarColor
            }))
        }))
      }));      
    } 

    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (e) {
    // timer({ ...metricsLabels, success: "false" });
    // throw e;
    return null;
  }
}
