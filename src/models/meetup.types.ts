export type MeetupItem = {
  /** Event ID */
  id: string;
  /** Auto-generated short UUID for this event */
  shortId: string;
  /** The ID of the group which created this event */
  groupId: string;
  /** The UUID of the event which this event was cloned from, or empty string */
  clonedId: string;
  /** Event settings */
  eventConfig: MeetupConfig;
  /** Event status and visibility */
  status: MeetupStatus;
  /** 1=location/address public, 2=location only visible to people going, 3=location hidden */
  privacy: MeetupPrivacy;
  /** The type of response a user can give for the event: Definite=yes/no, Indefinite=yes/no/maybe */
  rsvpType: MeetupRsvpCertainty;
  /** Main event title */
  eventTitle: string;
  /** Event subtitle */
  eventSubtitle: string;
  /** Event description - support HTML */
  eventDesc: string;
  /** Special notes about how to find the event once there */
  directions: string;
  /** Main category */
  category: MeetupCategory;
  /** List of tag-like subcategories */
  subcategory: string[];
  /** In-person, Online or Hybrid event */
  mode: MeetupMode;
  /** Full UTC timestamp */
  startTime: string;
  /** Full UTC timestamp */
  endTime: string;
  /** Event location @type MeetupLocation */
  location: MeetupLocation;
  /** Price in cents. @todo - entry fee? */
  price: MeetupPrice;
  /** List of event promo codes */
  promoCodes: MeetupPromoModifier[];
  /** @todo - give away vouchers during the event? */
  vouchers: unknown;
  /** List of user IDs who are on the waiting list */
  waitingList: MeetupWaitingList[];
  /** Topics and event tags */
  tags: string[];
  /** List of event hosts/admins */
  hosts: User[];
  /** List of event photos to promote the event. Featured photo will be one flagged, else first image */
  photos: MeetupMediaItem[];
};

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
type MeetupRsvpCertainty = 'DEFINITE' | 'INDEFINITE';
type MeetupStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type MeetupPrivacy = 1 | 2 | 3;

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
type MeetupCategoryValue = typeof MEETUP_CATEGORIES[keyof typeof MEETUP_CATEGORIES];
type MeetupCategory = keyof typeof MEETUP_CATEGORIES;


type MeetupMode = "IN_PERSON" | "ONLINE" | "HYBRID";
type MeetupLanguage = "EN" | "CA" | "ES" | "PT" | "IT" | "FR";
type MeetupLocation = {
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
type MeetupPrice = {
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
type MeetupWaitingList = {
  /** ID of the user on the list */
  userId: string;
  /** UTC time when the user joined the queue */
  joinedAt: string;
};

export type MeetupMediaItem = {
  id: string;
  url: string;
  alt: string;
  mediaType: "IMAGE" | "VIDEO";
  featured?: boolean;
  createdTime: string;
};

type MeetupPromoModifier = {
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

type MeetupRsvpResponseType = 'YES' | 'NO' | 'MAYBE';
type UserRsvpInfo = Pick<
  User,
  "nickname" | "email" | "telegram" | "firstname" | "lastname" | "mobile"
>;

type RsvpType = {
  /** UUID of the RSVP response */
  responseId: string;
  /** User UUID who responded */
  userId: User["id"];
  /** The response given by the user - if they are going or not! */
  response: MeetupRsvpResponseType;
  /** Timestamp of initial RSVP */
  responseTimestamp: string;
  /** Timestamp of updated RSVP when most recently changed */
  responseTimestampUpdated: string;
  /** Incremental number of times the user has edited their RSVP */
  changedTimes: number;
}
/** Type for people responding to meetup events */
export type MeetupRsvpResponse =
  /** Even though the user data can be looked up from the userID, this is what they share with the event in question */
  | Partial<UserRsvpInfo>
  /** Internal response mandatory data */
  | RsvpType;

export type User = {
  /** User UUID */
  id: string;
  /**
   * 1=User is active, 2=limited, 3=baned.
   * If 2: user cannot join an event by RSVP-ing
   * If 3: user cannot login at all
   */
  userStatus: 1 | 2 | 3;
  /** What they used to auth/login with */
  authMethod: "FB" | "IG" | "GOOGLE" | "EMAIL";
  /** The external auth token of their auth session */
  authToken: string;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** For resetting password via email */
  passwordResetToken?: string;
  /** If the user is a verified user (requires an admin to set) */
  isVerified?: boolean;
  /** User's firstname */
  firstname: string;
  /** User's lastname */
  lastname: string;
  /** User's email */
  email: string;
  /** Telegram username, without the @ */
  telegram?: string;
  /** User's nickname */
  nickname?: string;
  /** User phone number - will also work on WhatsApp */
  mobile: string;
  /** User's identity document */
  identity?: {
    /** User's DNI or NIE/TIE or Passport number */
    documentNumber: string;
    /** The type of document for the document number */
    documentType: "DNI" | "TIE" | "PASSPORT" | "OTHER";
  };
  /** Allows users to have credit to spend on going to paid events */
  credit: number;
  /** User's role */
  role: MeetupUserRole;
  /** Profile info about the user - will be HTML */
  about: string;
  /** User's current location city in Spain. Ex: Barcelona */
  currentLocation: string;
  /** ID of the neighbourhood */
  barrioId: number;
  /** UTC of the time that the user arrived in BCN */
  arrivedInBarcelona: string;
  /** User's profile pic */
  profilePhoto: MeetupMediaItem[];
  /** List of tag-like interests that the user has, like hiking, photography, cycling, food etc */
  interests: string[];
  /** Number of RSVPs that the user has done up to now */
  completedRSVPs: number;
  /** List of Group IDs that the user is following */
  followingGroupIds: string[];
};

export type MeetupUserRole = "ADMIN" | "HOST" | "USER";

export type MeetupGroup = {
  /** The UUID group ID */
  groupId: string;
  /** The group display name */
  groupName: string;
  /** @todo - Unique public API key for the group */
  apiKey: string;
  /** If the group has been verified by us as being a real human group */
  isVerified: boolean;
  /** List of event IDs related to this group */
  eventIds: MeetupItem["id"][];
  /** Profile photos for the groupd */
  profilePhoto: MeetupMediaItem[];
  /** HTML about the group */
  about: string;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** Tag-like list of topics and themes that the group is concerned with, such as: meetups, foreigners in BCN, english speaking, etc */
  topics: string[];
};
