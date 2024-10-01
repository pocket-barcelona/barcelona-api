import dynamoose from "dynamoose";
import type { Item } from 'dynamoose/dist/Item';
import { type MeetupRsvpModel, rsvpSchema } from './rsvp.model';
import { genericMediaAssetSchema, type GenericMediaItem } from './imageAssets';
import type { UserDocument } from './auth/user.model';
// import { questionSchema } from './poll.types';
// import { EventResponseModel } from "./event-responses.model";
// import { PollQuestions, PollQuestionsInput, PollResults, questionSchema } from "./types/poll.types";


const meetupConfigSchema = new dynamoose.Schema({
  requiresMobileNumber: {
    type: Boolean,
    required: false,
  },
  requiresIdentityCard: {
    type: Boolean,
    required: false,
  },
  requiresEmailAddress: {
    type: Boolean,
    required: false,
  },
  requiresQRCodeEntry: {
    type: Boolean,
    required: false,
  },
  requiresVerifiedUser: {
    type: Boolean,
    required: false,
  },
  minAttendees: {
    type: Number,
    required: false,
  },
  maxAttendees: {
    type: Number,
    required: false,
  },
  eventLanguage: {
    type: Array,
    required: false,
    schema: [String]
  },
});

const locationSchema = new dynamoose.Schema({
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
})

const meetupSchema = new dynamoose.Schema({
  meetupId: {
    type: String,
    required: true,
    hashKey: true,
  },
  shortId: {
    type: String,
    required: true,
  },
  groupId: { // the person/group hosting the event/meetup
    type: String,
    required: true,
  },
  clonedId: {
    type: String,
    required: true,
  },
  eventConfig: {
    type: Object,
    required: true,
    schema: [meetupConfigSchema]
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
  eventTitle: {
    type: String,
    required: true,
    default: '',
  },
  eventSubtitle: {
    type: String,
    required: true,
    default: '',
  },
  eventDesc: {
    type: String,
    required: true,
    default: '',
  },
  directions: {
    type: String,
    required: false,
    default: '',
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: Array,
    schema: [String],
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
    schema: [locationSchema],
  },
  price: {
    type: Object,
    required: true,
    schema: [priceSchema]
  },
  promoCodes: {
    type: Object,
    required: true,
    schema: [promoCodesSchema]
  },
  rsvps: {
    type: Array,
    required: true,
    schema: [rsvpSchema],
  },
  waitingList: {
    type: Array,
    required: true,
    schema: [String],
  },
  tags: {
    type: Array,
    required: true,
    schema: [String],
  },
  hosts: {
    type: Array,
    required: true,
    schema: [String],
  },
  photos: {
    type: Array,
    required: true,
    schema: [genericMediaAssetSchema],
  },
  // pollQuestions: {
  //   type: Array,
  //   schema: [questionSchema],
  //   required: false
  // }
}, {
  timestamps: true,
  saveUnknown: false,
});

// TYPES...

export enum MeetupStatusEnum {
  /** Events in draft state are not public */
  Draft = 1,
  /** An normal, published event. Users can rsvp */
  Published = 2,
  /** Archived events - support for when we need it. Archived events can be un-deleted */
  Archived = 3,
  /** Soft deleted events do not appear in any normal API data feed. They only exist in the database. */
  SoftDeleted = 4,
  /** @todo - Admin hard delete? */
  Deleted = 5,
}
export type MeetupConfig = {
  requiresMobileNumber?: boolean;
  requiresIdentityCard?: boolean;
  requiresEmailAddress?: boolean;
  requiresQRCodeEntry?: boolean;
  requiresVerifiedUser?: boolean;
  /** 0=any number, 1=min one attendee required for the event to start */
  minAttendees?: number;
  /** 0=any */
  maxAttendees?: number;
  /** List of languages people will be speaking at the event. If empty array, lang will be any language spoken */
  eventLanguage?: MeetupLanguage[];
};
export type MeetupRsvpCertainty = 'DEFINITE' | 'INDEFINITE';
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
export type MeetupLanguage = "EN" | "CA" | "ES" | "PT" | "IT" | "FR";
export type MeetupLocation = {
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
  locationPrecision: 1 | 2 | 3;
};
export type MeetupPrice = {
  /** Like 1050 = €10,50. 0=Free. -1=TBC */
  priceCents: number;
  /** For INTL, like EUR, GBP, USD etc */
  currencyCode: "EUR" | "GBP";
  /** Like: es-ES, en-GB, en-US */
  locale: string;
  /** Payment before event or when arriving? */
  paymentScheme: "ON_RSVP" | "ON_ARRIVAL" | "NONE"
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
  action?: "EARLY_RSVP" | string;
  /** If false, code will be in-active */
  active: boolean;
  /** Optional UTC timestamp of when the code expires */
  codeExpiryTime?: string;
};

export interface MeetupItem {
  /** Meetup ID */
  meetupId: string;
  /** Auto-generated short UUID for this meetup */
  shortId: string;
  /** The ID of the group which created this meetup */
  groupId: string;
  /** The UUID of the meetup which this meetup was cloned from, or empty string */
  clonedId: string;
  /** Meetup settings */
  eventConfig: MeetupConfig;
  /** Status and visibility */
  status: MeetupStatusEnum;
  /** 1=location/address public, 2=location only visible to people going, 3=location hidden */
  privacy: MeetupPrivacy;
  /** The type of response a user can give for the event: Definite=yes/no, Indefinite=yes/no/maybe */
  rsvpType: MeetupRsvpCertainty;
  /** Main title */
  eventTitle: string;
  /** Main subtitle */
  eventSubtitle: string;
  /** Main description - support HTML */
  eventDesc: string;
  /** Special notes about how to find the event once there */
  directions: string;
  /** Main category */
  category: MeetupCategoryName;
  /** List of tag-like subcategories */
  subcategory: string[];
  /** In-person, Online or Hybrid event */
  mode: MeetupMode;
  /** Full UTC timestamp */
  startTime: string;
  /** Full UTC timestamp */
  endTime: string;
  /** Meetup location @type MeetupLocation */
  location: MeetupLocation;
  /** Price in cents. @todo - entry fee? */
  price: MeetupPrice;
  /** List of event promo codes */
  promoCodes: MeetupPromoModifier[];
  /** @todo - give away vouchers during the event? */
  vouchers: unknown;
  /** People who have rsvp'd to this meetup */
  rsvps: MeetupRsvpModel[];
  /** List of user IDs who are on the waiting list */
  waitingList: MeetupWaitingList[];
  /** Topics and event tags */
  tags: string[];
  /** List of event hosts/admins */
  hosts: string[];
  /** List of photos to promote the meetup. Featured photo will be one flagged, else first image */
  photos: GenericMediaItem[];
  // responses: Array<EventResponseModel>;
}
export interface MeetupDocument extends Item, MeetupItem {
  createdAt: Date;
  updatedAt: Date;
}


export const MEETUP_TABLE_NAME = 'Meetup';
const MeetupModel = dynamoose.model<MeetupDocument>(MEETUP_TABLE_NAME, meetupSchema);

export default MeetupModel;
