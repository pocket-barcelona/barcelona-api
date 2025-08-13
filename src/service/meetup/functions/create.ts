import { v4 as uuidv4 } from 'uuid';
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
	RsvpButtonCtaDefault,
	type RsvpButtonCtaTypes,
	TicketTypeEnum,
} from '../../../models/meetup.model.js';
import type { CreateMeetupInput } from '../../../schema/meetup/meetup.schema.js';
import generateShortId from '../../../utils/generateMeetupShortId.js';

export default async function create(
	input: CreateMeetupInput['body'],
	userId: string
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
			// @todo - creator user ID?
			groupId: input.groupId,
			description: input.description,
			status: MeetupStatusEnum.Draft, // this is the status of newly created document
			privacy: 1 as MeetupPrivacy,
			rsvpType: input.rsvpType as MeetupRsvpCertainty,
			ticketTypes: TicketTypeEnum.Standard,
			maxTicketsPerPerson: 1,
			meetupId: uuidv4(),
			shortId: await generateShortId(),
			startTime: new Date(input.startTime),
			endTime: new Date(input.endTime),
			rsvpOpensAt: new Date(),
			rsvpClosesAt: new Date(input.endTime),
			location: {
				...input.location,
			},
			locationDisclosureAt: new Date(),
			title: input.title ?? '',
			subtitle: input.subtitle ?? '',
			directions: input.directions ?? '',
			category: input.category as MeetupCategoryName,
			subcategory: input.subcategory ?? [],
			mode: input.mode as MeetupMode,
			rsvps: [],
			promoCodes: [],
			photos: [],
			vouchers: [],
			requiresUserCheckin: false,
			price: {
				...input.price,
			} as MeetupPrice,
			tags: input.tags ?? [],
			hosts: input.hosts ?? [],
			waitingList: [],
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

function getMeetupConfig(input: CreateMeetupInput['body']): MeetupConfig {
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
		rsvpButtonCtaType = RsvpButtonCtaDefault,
		enableWaitingList = false,
		maxWaitingListGuests = 0,
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
		rsvpButtonCtaType: rsvpButtonCtaType as RsvpButtonCtaTypes,
		enableWaitingList,
		maxWaitingListGuests,
	};
	return config;
}
