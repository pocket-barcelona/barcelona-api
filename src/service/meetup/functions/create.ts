import MeetupModel, { type MeetupDocument, MeetupStatusEnum } from "../../../models/meetup.model";
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
    
    // const pollQuestions = input.pollQuestions?.map((question) => ({
    //   id: uuidv4(),
    //   content: question.content,
    //   description: question.description,
    //   customAnswers: question.customAnswers ?? false,
    //   possibleAnswers: question.possibleAnswers.map((possibleAnswer) => ({
    //     id: uuidv4(),
    //     content: possibleAnswer.content
    //   })),
    //   answers: []
    // }));

    const userInput: Partial<MeetupDocument> = {
      groupId: hostId,
      eventDesc: input.eventDesc,
      status: MeetupStatusEnum.Draft, // this is the status of newly created document
      meetupId: uuidv4(),
      shortId: await generateShortId(),
      startTime: new Date(input.startTime).toISOString(),
      endTime: new Date(input.endTime).toISOString(),
      rsvps: [],
      //...@todo more
    };
    const newEvent = Object.assign({}, input, userInput);

    const result = await MeetupModel.create(newEvent).catch((err) => {
      // logger.warn(err);
      // timer({ ...metricsLabels, success: "false" });
      // return a validation error if present
      if (err?.message) return err.message;
      return null;
    });

    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (err: unknown) {
    // post values were malformed
    // timer({ ...metricsLabels, success: "false" });
    // throw e;
    return null;
  }
}
