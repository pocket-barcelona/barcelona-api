import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import { type MeetupRsvpModel, rsvpSchema } from "./rsvp.model";
import {
  genericMediaAssetSchema,
  type GenericMediaItem,
} from "./imageAssets.model";
// import { questionSchema } from './poll.types';
// import { EventResponseModel } from "./event-responses.model";
// import { PollQuestions, PollQuestionsInput, PollResults, questionSchema } from "./types/poll.types";

const meetupConfigSchema = new dynamoose.Schema({
  minAttendees: {
    type: Number,
    required: true,
  },
  maxAttendees: {
    type: Number,
    required: true,
  },
  requiresMobileNumber: {
    type: Boolean,
  },
  requiresIdentityCard: {
    type: Boolean,
  },
  requiresEmailAddress: {
    type: Boolean,
  },
  requiresQRCodeEntry: {
    type: Boolean,
  },
  requiresVerifiedUser: {
    type: Boolean,
  },
  eventLanguage: {
    type: Array,
    schema: [
      {
        type: String,
      },
    ],
  },
  rsvpButtonCtaType: {
    type: String,
  },
  enableWaitingList: {
    type: Boolean,
  }
}, {
  saveUnknown: true,
});

const locationSchema = new dynamoose.Schema({
  locationName: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    required: true,
  },
  town: {
    type: String,
    required: true,
  },
  postcode: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  locationPrecision: {
    type: Number,
    required: true,
  },
  mapsLink: {
    type: String,
    required: true,
  }
}, {
  saveUnknown: true,
});

const priceSchema = new dynamoose.Schema({
  priceCents: {
    type: Number,
    required: true,
  },
  currencyCode: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  paymentScheme: {
    type: String,
    required: true,
  },
  canUseCredit: {
    type: Boolean,
    required: true,
  },
});

const promoCodesSchema = new dynamoose.Schema({
  active: {
    type: Boolean,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountCents: {
    type: Number,
    required: true,
  },
  currencyCode: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
  codeExpiryTime: {
    type: Date,
    required: true,
  },
});

const meetupHostsSchema = new dynamoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hostRole: {
    type: String,
    required: true,
  },
  isOrganiser: {
    type: Boolean,
  }
});

const meetupSchema = new dynamoose.Schema(
  {
    meetupId: {
      type: String,
      required: true,
      hashKey: true,
    },
    shortId: {
      type: String,
      required: true,
    },
    groupId: {
      // the person/group hosting the event/meetup
      type: String,
      required: true,
    },
    clonedId: {
      type: String
    },
    eventConfig: {
      type: Object,
      required: true,
      // @todo - this doesn't seem to work for some reason!
      // schema: [meetupConfigSchema],
    },
    status: {
      type: String,
      required: true,
    },
    privacy: {
      type: Number,
      required: true,
    },
    rsvpType: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "",
    },
    subtitle: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    directions: {
      type: String,
      required: false,
      default: "",
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: {
      type: Array,
      schema: [
        {
          type: String,
        },
      ],
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    location: {
      type: Object,
      required: true,
      // schema: [locationSchema],
    },
    price: {
      type: Object,
      required: true,
      // schema: [priceSchema],
    },
    promoCodes: {
      type: Array,
      required: true,
      schema: [promoCodesSchema],
    },
    rsvps: {
      type: Array,
      required: true,
      schema: [rsvpSchema],
    },
    waitingList: {
      type: Array,
      schema: [
        {
          type: String,
        },
      ],
    },
    tags: {
      type: Array,
      required: true,
      schema: [
        {
          type: String,
        },
      ],
    },
    hosts: {
      type: Array,
      required: true,
      schema: [meetupHostsSchema],
    },
    photos: {
      type: Array,
      required: true,
      schema: [genericMediaAssetSchema],
    },
    // @todo - answer some questions when you join the meetup...
    // pollQuestions: {
    //   type: Array,
    //   schema: [questionSchema],
    //   required: false
    // }
  },
  {
    timestamps: true,
    saveUnknown: [
      "eventConfig.*",
      "location.*",
      "price.*",
    ],
    // validate: (newItem) => {
    //   console.log(newItem)
    //   return true;
    // }
  }
);


/** Note: Needs to support Bitwise, so binary values
 * More types: https://www.eventbrite.com/blog/types-event-tickets-ds00/
 */
export enum TicketTypeEnum {
  WaitingList = 1,
  PreSale = 2,
  SuperEarlyBird = 4,
  EarlyBird = 8,
  Standard = 16, // general admission
  VIP = 32,
  SingleDayPass = 64,
  MultiDayPass = 128,
  GroupPass = 256,
  MemberOnlyTickets = 512,
  EntranceOnly = 1024,
}

/**
 * Status flow:
 * 
 * `Draft -> Archived/Deleted (never went live)`
 *
 * `Draft -> Provisional -> Published`
 * 
 * `@todo: Draft -> Published -> Ended` (system will either set ended or infer the status)
 * 
 * `Draft -> Published -> Cancelled`
 * 
 * `Draft -> Published -> Cancelled -> SoftDeleted`
 */
export enum MeetupStatusEnum {
  /** Meetup is in draft state. Not public or visible yet */
  Draft = 'DRAFT',
  /** Meetup is accepting RSVPs but not fully confirmed yet. */
  Provisional = 'PROVISIONAL',
  /** Meetup is confirmed and published. People can rsvp */
  Published = 'PUBLISHED',
  /** @todo. Explicitly set to ended. */
  Ended = 'ENDED',
  /** Meetup has been either provisional or published, but is now cancelled. */
  Cancelled = 'CANCELLED',
  /** Support for when we need it. Archived events can be un-deleted */
  Archived = 'ARCHIVED',
  /** Soft deleted events do not appear in any normal API data feed. They only exist in the database. */
  SoftDeleted = 'SOFTDELETED',
  /** @todo - Admin hard delete? */
  Deleted = 'DELETED',
}
export type MeetupConfig = {
  /** 0=any number, 1=min one attendee required for the event to start */
  minAttendees: number;
  /** 0=any */
  maxAttendees: number;
  /** Require mobile number on signing up for the event */
  requiresMobileNumber?: boolean;
  /** Require email address on signing up for the event */
  requiresEmailAddress?: boolean;
  /** Require QR code when physically entering the event */
  requiresQRCodeEntry?: boolean;
  /** Require identity card when physically entering the event */
  requiresIdentityCard?: boolean;
  /** Requires a user to be registered and email confirmed */
  requiresVerifiedUser?: boolean;
  /** List of languages people will be speaking at the event. If empty array, lang will be any language spoken */
  eventLanguage?: string[];
  /** Allow meetup organisers to customise the RSVP join button when users join the event */
  rsvpButtonCtaType?: RsvpButtonCtaTypes;
  /** If true, people will be able to RSVP as coming, but will be put on the waiting list if the event is full already */
  enableWaitingList?: boolean;
};
// export const RsvpButtonCtas = {
//   JOIN: 'Join',
//   RSVP: 'RSVP',
//   GET_TICKET: 'Get Ticket',
//   COMING: 'Coming',
//   REPLY: 'Reply',
//   CONNECT: 'Connect',
//   ATTEND: 'Attend',
//   GOING: 'Going',
//   CONFIRM: 'Confirm',
//   REGISTER: 'Register'
// };
export type RsvpButtonCtaTypes = "RSVP" | "JOIN" | "GET_TICKET" | "COMING" | "REPLY" | "CONNECT" | "ATTEND" | "GOING" | "CONFIRM" | "REGISTER" | "RESPOND" | "SIGNUP";
export const RsvpButtonCtaDefault = 'ATTEND' satisfies RsvpButtonCtaTypes;
export type MeetupRsvpCertainty = "DEFINITE" | "INDEFINITE";
export type MeetupPrivacy = 1 | 2 | 3;
export const MEETUP_CATEGORIES = {
  MEETUP: "MEETUP", // regular meetup with big group
  LIVEMUSIC: "LIVEMUSIC", // gigs, karaoke etc
  ENTERTAINMENT: "ENTERTAINMENT", // standup comedy, talks, film nights
  RESTAURANT: "RESTAURANT", // go for dinner
  COFFEE: "COFFEE", // share a coffee with people
  TRAVEL: "TRAVEL", // travel and outdoor
  SPORT: "SPORT", // beach volley, running etc
  LIFESTYLE: "LIFESTYLE", // e.g. yoga, dance
  ART: "ART", // art gallery, trip to museum, gallery open day etc
  HOBBIES: "HOBBIES", // photography walks etc
  HEALTH: "HEALTH", // health and wellbeing
  CULTURAL: "CULTURAL", // e.g. ICD BCN
  COMMUNITY: "COMMUNITY", // neighbourhood meetup, civic meetup, etc
  GAMES: "GAMES", // e.g. boardgame, gaming etc
  SKILLSWAP: "SKILLSWAP", // sharing skills e.g. language exchange
  EDUCATION: "EDUCATION", // science, education, learning etc
  NETWORKING: "NETWORKING", // e.g. job search etc
  PROFESSIONAL: "PROFESSIONAL", // tech talks etc
  BUSINESS: "BUSINESS",
  TECH: "TECH", // tech fair, IT, devs etc
  OUTDOOR: "OUTDOOR", // hiking etc
  PRIVATE: "PRIVATE", // private drinks on a terrace, etc
  OPENDAY: "OPENDAY", // e.g. co-working open days etc
  FESTIVAL: "FESTIVAL",
  PARENTAL: "PARENTAL", // parenting and family
  ANIMALS: "ANIMALS", // pets and animals etc
  OTHER: "OTHER",
} as const;
// type MeetupCategoryValue = typeof MEETUP_CATEGORIES[keyof typeof MEETUP_CATEGORIES];
export type MeetupCategoryName = keyof typeof MEETUP_CATEGORIES;
export type MeetupMode = "IN_PERSON" | "ONLINE" | "HYBRID";
// export type MeetupLanguage = "EN" | "CA" | "ES" | "PT" | "IT" | "FR";
export type MeetupLocation = {
  /** The name of the location */
  locationName: string;
  /** Street address */
  address1: string;
  /** locale address or neighbourhood */
  address2: string;
  /** postcode */
  postcode: string;
  /** town/city */
  town: string;
  /** Region or province */
  province: string;
  /** Country */
  country: string;
  /** Ex: Door 1 */
  notes: string;
  /** Full latitude, from Google */
  lat: number;
  /** Full longitude, from Google */
  lng: number;
  /** 1=show exact location,2=show radius,3=show city only,4=hide location */
  locationPrecision: 1 | 2 | 3 | number;
  /** Ex: a google maps URL to the meetup location */
  mapsLink: string;
};
export type MeetupPrice = {
  /** Like 1050 = €10,50. 0=Free. -1=TBC */
  priceCents: number;
  /** For INTL, like EUR, GBP, USD etc */
  currencyCode: "EUR" | "GBP";
  /** Like: es-ES, en-GB, en-US */
  locale: string;
  /** Payment before event or when arriving? */
  paymentScheme: "ON_RSVP" | "ON_ARRIVAL" | "NONE";
  /** Whether or not user credit can be used to pay for the event */
  canUseCredit: boolean;
};
export type MeetupWaitingList = {
  /** ID of the user on the list */
  userId: string;
  /** UTC time when the user joined the queue */
  joinedAt: string;
};
export type MeetupPromoModifier = {
  code: string;
  /** Ex: "50% off with this code" */
  description: string;
  /** 0.5 would be 50% off */
  modifier?: number;
  /** @todo - Type of action applied to the event when the code is entered by the user */
  action?: "EARLY_RSVP" | "PRIVATE_RSVP" | "PRICE_DISCOUNT" | string;
  /** If false, code will be in-active */
  active: boolean;
  /** Optional UTC timestamp of when the code expires */
  codeExpiryTime?: string;
};

type HostRoleType = 'ORGANISER' | 'CO_ORGANISER' | 'COMMUNITY_MANAGER';
export type MeetupHostList = {
  /** ID of the user on the list */
  userId: string;
  /** The role that this person has for the event */
  hostRole: HostRoleType | string;
  isOrganiser?: boolean;
}

export interface MeetupItem {
  /** Meetup ID */
  meetupId: string;
  /** Auto-generated short UUID for this meetup */
  shortId: string;
  /** The ID of the group which created this meetup */
  groupId: string;
  /** The UUID of the meetup which this meetup was cloned from, or empty string */
  clonedId?: string;
  /** Meetup settings */
  eventConfig: MeetupConfig;
  /** Event Main category */
  category: MeetupCategoryName;
  /** List of tag-like subcategories */
  subcategory: string[];
  /** Status and visibility */
  status: MeetupStatusEnum;
  /** 1=location/address public, 2=location only visible to people going, 3=location hidden */
  privacy: MeetupPrivacy;
  /** The type of response a user can give for the event: Definite=yes/no, Indefinite=yes/no/maybe */
  rsvpType: MeetupRsvpCertainty;
  /** @bitwise Which tickets the event is offering to people. Note: uses Bitwise for multiple choice */
  ticketTypes: TicketTypeEnum;
  /** Sets a limit on the number of tickets a person can obtain (per their user) */
  maxTicketsPerPerson: number;
  /** Main title */
  title: string;
  /** Main subtitle */
  subtitle: string;
  /** Main description - supports HTML */
  description: string;
  /** Special notes about how to find the event once there */
  directions: string;
  /** In-person, Online or Hybrid event */
  mode: MeetupMode;
  /** Full UTC timestamp */
  startTime: Date;
  /** Full UTC timestamp */
  endTime: Date;
  /** Before this date, RSVP-ing to the event will not be permitted */
  rsvpOpensAt?: Date;
  /** After this date, RSVP-ing to the event will not be permitted */
  rsvpClosesAt?: Date;
  /** Meetup location @type MeetupLocation */
  location: MeetupLocation;
  /** The datetime from which the meetup location will be disclosed to the user */
  locationDisclosureAt: Date;
  /** Price in cents. @todo - entry fee? */
  price: MeetupPrice;
  /** @todo - check relationship with TicketTypeEnum above.
   * List of event promo codes */
  promoCodes: MeetupPromoModifier[];
  /** @todo - give away vouchers during the event? */
  vouchers: unknown;

  /** @todo - move to config? If true, the person who RSVP'd will need to re-confirm their attendance */
  requiresUserCheckin: boolean;

  /** People who have rsvp'd to this meetup */
  rsvps: MeetupRsvpModel[];
  /** List of user IDs who are on the waiting list */
  waitingList?: MeetupWaitingList[];
  /** Topics and event tags */
  tags: string[];
  /** List of event hosts/admins */
  hosts: MeetupHostList[];
  /** List of photos to promote the meetup. Featured photo will be one flagged, else first image */
  photos: GenericMediaItem[];
  // responses: Array<EventResponseModel>;
  // @todo - requires bizum before arrival?
}
export interface MeetupDocument extends Item, MeetupItem {
  createdAt: Date;
  updatedAt: Date;
}

export const MEETUP_TABLE_NAME = "Meetup";
const MeetupModel = dynamoose.model<MeetupDocument>(
  MEETUP_TABLE_NAME,
  meetupSchema
);

export default MeetupModel;
