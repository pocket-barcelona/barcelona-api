import type { EventGroup, EventRsvpResponse, EventType, User } from '../models/meetup.types';

const group: EventGroup = {
  groupId: "my-parent-group",
  groupName: "BCN English Speakers",
  apiKey: "123-abc-456-def",
  eventIds: ["abc-123"],
  profilePhoto: [
    {
      id: "123",
      url: "my-photo.avif",
      alt: "Juan cara",
      mediaType: "IMAGE",
      createdTime: "2024-07-25T17:35:48.171Z",
      featured: true,
    },
  ],
  about:
    "<h2>BCN English Speakers heading here</h2><p>We are a group doing meetups every month blah...</p>",
  signupDate: "2024-07-25T17:35:48.171Z",
  lastLogin: "2024-09-23T17:35:48.171Z",
  isVerified: true,
  topics: [
    "new_in_town",
    "make_new_friends",
    "nightlife",
    "singles",
    "practice_english",
    "expat_meetups",
  ],
};

const event: EventType = {
  id: "abc-123-def-456",
  shortId: "abc-123",
  groupId: "abc-parent-group-id",
  clonedUUID: "ghi-789-jkl-111",
  eventConfig: {
    requiresVerifiedUser: true,
  },
  status: "DRAFT",
  privacy: 1,
  rsvpType: 'DEFINITE',
  eventTitle: "My fantastic meeting",
  eventSubtitle: "Doing meetups since 1999!",
  eventDesc: `
    <p>Welcome to the greatest meetup in the sky.</p><p>It will be awesome.</p>
    `,
  howToFindEvent:
    "When you arrive, head downstairs and we will be there. The admins will be wearing yellow armbands. Come say hi!",
  category: "MEETUP",
  subcategory: ["social", "drinks", "karaoke"],
  mode: "IN_PERSON",
  startTime: "2024-09-25T17:35:48.171Z",
  endTime: "2024-09-26T17:35:48.171Z",
  location: {
    address1: "123 Memory Lane",
    address2: "Awesome Neighbourhood",
    town: "Barcelona",
    postcode: "08001",
    country: "Spain",
    notes: "",
    lat: 0,
    lng: 0,
    locationPrecision: 1,
  },
  price: {
    priceCents: 0,
    currencyCode: "EUR",
    canUseCredit: false,
  },
  promoCodes: [
    {
      active: true,
      code: "EARLY_EXPAT_24",
      description: "Get early bird RSVP access to the event",
      action: "EARLY_RSVP",
      codeExpiryTime: "2024-09-01T17:35:48.171Z",
    },
  ],
  vouchers: undefined,
  minAttendees: 0,
  maxAttendees: 150,
  waitingList: [],
  tags: ["meetup", "bcn_english_speakers", "drinks", "decode"],
  hosts: [],
  photos: [
    {
      id: "123",
      mediaType: "IMAGE",
      alt: "Group shot",
      featured: true,
      url: "https://placehold.it/320/320",
      createdTime: "2024-07-25T17:35:48.171Z"
    },
  ],
  eventLanguage: ["EN"],
};

const user: User = {
  id: "abcd",
  userStatus: 1,
  signupDate: "2024-08-01T17:35:48.171Z",
  lastLogin: "2024-09-05T17:35:48.171Z",
  authMethod: "IG",
  authToken: "XXXX-XXXX-XXXX-XXXX",
  firstname: "Juan",
  lastname: "Doe",
  email: "juan.doe@gmail.com",
  telegram: "juanboy_99",
  nickname: "Juanita",
  mobile: "",
  credit: 250,
  role: "USER",
  about: "I like table tennis, volleyball and cycling.",
  currentLocation: "Spain",
  barrioId: 11,
  arrivedInBarcelona: "",
  profilePhoto: [
    {
      id: "123",
      url: "my-photo.avif",
      alt: "Juan cara",
      mediaType: "IMAGE",
      featured: true,
      createdTime: "2024-07-25T17:35:48.171Z"
    },
  ],
  completedRSVPs: 1,
  followingGroupIds: [],
  interests: ["Hiking", "Cocktails", "Socializing", "Meetups", "Music"],
  // optionals...
  isVerified: true,
  passwordResetToken: "",
  identity: {
    documentNumber: "Y123456780A",
    documentType: "TIE",
  },
};

const userRsvpResponse: EventRsvpResponse = {
  responseId: "XXXXXXX",
  userId: "abcd",
  response: 'YES',
  responseTimestamp: "2024-09-01T17:35:48.171Z",
  responseTimestampUpdated: "",
  mobile: '+34 612 345 678',
};
