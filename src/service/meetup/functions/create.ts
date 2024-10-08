import MeetupModel, {
  type MeetupCategoryName,
  type MeetupConfig,
  type MeetupDocument,
  type MeetupItem,
  type MeetupMode,
  type MeetupPrice,
  type MeetupPrivacy,
  type MeetupRsvpCertainty,
  MeetupStatusEnum,
} from "../../../models/meetup.model";
import type { CreateMeetupInput } from "../../../schema/meetup/meetup.schema";
import { v4 as uuidv4 } from "uuid";
import generateShortId from "../../../utils/generateMeetupShortId";

export default async function create(
  input: CreateMeetupInput["body"],
  hostId: string
): Promise<MeetupDocument | null | string> {
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

    const eventConfig = getMeetupConfig(input);
    const newItem: MeetupItem = {
      groupId: hostId,
      description: input.description,
      status: MeetupStatusEnum.Draft, // this is the status of newly created document
      privacy: 1 as MeetupPrivacy,
      rsvpType: input.rsvpType as MeetupRsvpCertainty,
      meetupId: uuidv4(),
      shortId: await generateShortId(),
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      location: {
        ...input.location,
      },
      title: input.title ?? "",
      subtitle: input.subtitle ?? "",
      directions: input.directions ?? "",
      category: input.category as MeetupCategoryName,
      subcategory: input.subcategory ?? [],
      mode: input.mode as MeetupMode,
      rsvps: [],
      promoCodes: [],
      photos: [],
      vouchers: [],
      price: {
        ...input.price,
      } as MeetupPrice,
      tags: input.tags ?? [],
      hosts: input.hosts ?? [],
      eventConfig,
    };
    
    const result = await MeetupModel.create(newItem).catch((err) => {
      if (err?.message) return err.message;
      return null;
    });

    return result;
  } catch (err: unknown) {
    return null;
  }
}

function getMeetupConfig(input: CreateMeetupInput["body"]): MeetupConfig {
  const { eventConfig } = input;
  const {
    minAttendees = 0,
    maxAttendees = 0,
    eventLanguage = [],
    requiresEmailAddress = false,
    requiresIdentityCard = false,
    requiresMobileNumber = false,
    requiresQRCodeEntry = false,
    requiresVerifiedUser = false,
  } = eventConfig;
  const config: MeetupConfig = {
    minAttendees,
    maxAttendees,
    eventLanguage,
    requiresEmailAddress,
    requiresIdentityCard,
    requiresMobileNumber,
    requiresQRCodeEntry,
    requiresVerifiedUser,
  };
  return config;
}
