import { UserEmailConfirmedEnum, type UserInput, UserRoleEnum } from '../models/auth/user.model.js';
import { type MeetupItem, MeetupStatusEnum, TicketTypeEnum } from '../models/meetup.model.js';
import type { MeetupGroupItem } from '../models/meetupGroup.model.js';

// import type { MeetupRsvpResponse } from '../models/rsvp.model.js';

// biome-ignore lint/correctness/noUnusedVariables: WIP
const group: MeetupGroupItem = {
	ownerId: 'test',
	groupId: 'my-parent-group',
	groupName: 'BCN English Speakers',
	groupLocation: 'Barcelona',
	apiKey: '123-abc-456-def',
	meetupIds: ['abc-123'],
	logo: [
		{
			id: '1234',
			url: 'my-logo.png',
			alt: 'My logo',
			mediaType: 'IMAGE',
			createdTime: new Date('2024-07-25T17:35:48.171Z'),
			featured: true,
		},
	],
	profilePhoto: [
		{
			id: '123',
			url: 'my-photo.avif',
			alt: 'Juan cara',
			mediaType: 'IMAGE',
			createdTime: new Date('2024-07-25T17:35:48.171Z'),
			featured: true,
		},
	],
	about:
		'<h2>BCN English Speakers heading here</h2><p>We are a group doing meetups every month blah...</p>',
	signupDate: new Date('2024-07-25T17:35:48.171Z'),
	lastLogin: new Date('2024-09-23T17:35:48.171Z'),
	isVerified: true,
	isPublic: true,
	topics: [
		'new_in_town',
		'make_new_friends',
		'nightlife',
		'singles',
		'practice_english',
		'expat_meetups',
	],
	slug: 'bcn-eng-speakers',
	refundPolicy: '',
	social: {
		facebook: '',
		instagram: '',
		whatsapp: '',
		telegram: '',
		linkedin: '',
		tiktok: '',
		twitter: '',
		website: '',
		youtube: '',
		bizum: '',
	},
	timezone: 'Europe/Madrid',
};

// biome-ignore lint/correctness/noUnusedVariables: WIP
const event: MeetupItem = {
	meetupId: 'abc-123-def-456',
	shortId: 'abc-123',
	groupId: 'abc-parent-group-id',
	clonedId: 'ghi-789-jkl-111',
	eventConfig: {
		requiresVerifiedUser: true,
		minAttendees: 0,
		maxAttendees: 150,
		eventLanguage: ['EN'],
	},
	status: MeetupStatusEnum.Draft,
	privacy: 1,
	rsvpType: 'DEFINITE',
	ticketTypes: TicketTypeEnum.Standard,
	maxTicketsPerPerson: 1,
	title: 'My fantastic meeting',
	subtitle: 'Doing meetups since 1999!',
	description: `
    <p>Welcome to the greatest meetup in the sky.</p><p>It will be awesome.</p>
    `,
	directions:
		'When you arrive, head downstairs and we will be there. The admins will be wearing yellow armbands. Come say hi!',
	category: 'MEETUP',
	subcategory: ['social', 'drinks', 'karaoke'],
	mode: 'IN_PERSON',
	startTime: new Date('2024-09-25T17:35:48.171Z'),
	endTime: new Date('2024-09-26T17:35:48.171Z'),
	rsvpOpensAt: new Date('2024-08-03T17:00:00.171Z'), // just before the event start
	rsvpClosesAt: new Date('2024-09-25T17:00:00.171Z'), // just before the event start
	location: {
		locationName: 'Cool location name',
		address1: '123 Memory Lane',
		address2: 'Awesome Neighbourhood',
		town: 'Barcelona',
		postcode: '08001',
		province: 'Barcelona Area',
		country: 'Spain',
		notes: '',
		lat: 0,
		lng: 0,
		locationPrecision: 1,
		mapsLink: '',
		locationIsHidden: false,
		locationAvailableFrom: Date.now(),
	},
	locationDisclosureAt: new Date('2024-09-20T09:00:00.000Z'),
	price: {
		priceCents: 0,
		currencyCode: 'EUR',
		locale: 'es-ES',
		canUseCredit: false,
		paymentScheme: 'NONE',
	},
	promoCodes: [
		{
			active: true,
			code: 'EARLY_EXPAT_24',
			description: 'Get early bird RSVP access to the event',
			action: 'EARLY_RSVP',
			codeExpiryTime: '2024-09-01T17:35:48.171Z',
		},
	],
	vouchers: undefined,
	requiresUserCheckin: true,
	waitingList: [],
	tags: ['meetup', 'bcn_english_speakers', 'drinks', 'decode'],
	hosts: [],
	photos: [
		{
			id: '123',
			mediaType: 'IMAGE',
			alt: 'Group shot',
			featured: true,
			url: 'https://placehold.it/320/320',
			createdTime: new Date('2024-07-25T17:35:48.171Z'),
		},
	],
	rsvps: [],
};

// biome-ignore lint/correctness/noUnusedVariables: WIP
const user: UserInput = {
	userId: 'abcd',
	role: UserRoleEnum.Admin,
	userStatus: 1,
	signupDate: new Date(), // "2024-08-01T17:35:48.171Z"
	lastLogin: new Date(), // "2024-09-05T17:35:48.171Z"
	authMethod: 'IG',
	authToken: 'XXXX-XXXX-XXXX-XXXX',
	firstname: 'Juan',
	lastname: 'Doe',
	email: 'juan.doe@gmail.com',
	telegram: 'juanboy_99',
	nickname: 'Juanita',
	mobile: '',
	credit: 250,
	// role: "USER",
	about: 'I like table tennis, volleyball and cycling.',
	currentLocation: 'Spain',
	barrioId: 11,
	arrivedInBarcelona: '',
	profilePhoto: [
		{
			id: '123',
			url: 'my-photo.avif',
			alt: 'Juan cara',
			mediaType: 'IMAGE',
			featured: true,
			createdTime: new Date('2024-07-25T17:35:48.171Z'),
		},
	],
	completedRSVPs: 1,
	followingGroupIds: [],
	interests: ['Hiking', 'Cocktails', 'Socializing', 'Meetups', 'Music'],
	isVerified: true,
	identity: {
		documentNumber: 'Y123456780A',
		documentType: 'TIE',
	},
	emailConfirmed: UserEmailConfirmedEnum.Unconfirmed,
	utmSource: '',
	utmMedium: '',
	utmCampaign: '',
	avatarColor: '',
};

// const userRsvpResponse: MeetupRsvpResponse = {
//   responseId: "XXXXXXX",
//   userId: "abcd",
//   response: 'YES',
//   responseTimestamp: "2024-09-01T17:35:48.171Z",
//   responseTimestampUpdated: "",
//   mobile: '+34 612 345 678',
// };
