import EventModel, { type MeetupDocument, MeetupStatusEnum } from "../../../models/meetup.model";
import type { CreateMeetupInput } from "../../../schema/meetup/meetup.schema";
import { v4 as uuidv4 } from 'uuid';
import generateShortId from "../../../utils/generateMeetupShortId";

export default async function create(
  input: CreateMeetupInput["body"],
  hostId: string
): Promise<MeetupDocument | null | string> {
  const metricsLabels = {
    operation: "createEvent",
  };

  // const timer = databaseResponseTimeHistogram.startTimer();
  try {
    
    const pollQuestions = input.pollQuestions?.map((question) => ({
      id: uuidv4(),
      content: question.content,
      description: question.description,
      customAnswers: question.customAnswers ?? false,
      possibleAnswers: question.possibleAnswers.map((possibleAnswer) => ({
        id: uuidv4(),
        content: possibleAnswer.content
      })),
      answers: []
    }));

    const userInput: Partial<MeetupDocument> = {
      hostId,
      activityDescription: input.activityDescription ?? 'do something',
      status: MeetupStatusEnum.Published, // this is the status of newly created document
      id: uuidv4(),
      shortId: await generateShortId(),
      startTime: input.startTime ? new Date(input.startTime) : undefined,
      endTime: input.endTime ? new Date(input.endTime) : undefined,
      responses: [],
      pollQuestions: pollQuestions ?? []
    };
    const newEvent = Object.assign({}, input, userInput);

    const result = await EventModel.create(newEvent).catch((err) => {
      // logger.warn(err);
      // timer({ ...metricsLabels, success: "false" });
      // return a validation error if present
      if (err?.message) return err.message;
      return null;
    });

    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (err: any) {
    // post values were malformed
    // timer({ ...metricsLabels, success: "false" });
    // throw e;
    return null;
  }
}
