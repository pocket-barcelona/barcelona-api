export type EventType = {
  /** The ID of the group which created this event */
  groupId: string;
  /** Event ID */
  id: string;
  /** The UUID of the event which this event was cloned from, or empty string */
  clonedUUID: string;
  /** Event settings */
  eventConfig: EventConfig;
  /** Event status and visibility */
  status: EventStatus;
  /** 1=location/address public, 2=location only visible to people going, 3=location hidden */
  privacy: EventPrivacy;
  /** The type of response a user can give for the event: Definite=yes/no, Indefinite=yes/no/maybe */
  rsvpType: 'DEFINITE' | 'INDEFINITE';
  /** Main event title */
  eventTitle: string;
  /** Event subtitle */
  eventSubtitle: string;
  /** Event description - support HTML */
  eventDesc: string;
  /** Special notes about how to find the event once there */
  howToFindEvent: string;
  /** Main category */
  category: EventCategory;
  /** List of tag-like subcategories */
  subcategory: string[];
  /** In-person, Online or Hybrid event */
  mode: EventMode;
  /** Full UTC timestamp */
  startTime: string;
  /** Full UTC timestamp */
  endTime: string;
  /** Event location @type EventLocation */
  location: EventLocation;
  /** Price in cents. @todo - entry fee? */
  price: EventPrice;
  /** List of event promo codes */
  promoCodes: EventPromoModifier[];
  /** @todo - give away vouchers during the event? */
  vouchers: unknown;
  /** 0=any number, 1=min one attendee required for the event to start */
  minAttendees: number;
  /** 0=any */
  maxAttendees: number;
  /** List of user IDs who are on the waiting list */
  waitingList: EventWaitingList[];
  /** Topics and event tags */
  tags: string[];
  /** List of event hosts/admins */
  hosts: User[];
  /** List of event photos to promote the event. Featured photo will be one flagged, else first image */
  photos: MediaItem[];
  /** List of languages people will be speaking at the event. If empty array, lang will be any language spoken */
  eventLanguage: EventLanguage[];
};

export type EventConfig = {
  requiresMobileNumber?: boolean;
  requiresIdentityCard?: boolean;
  requiresEmailAddress?: boolean;
  requiresQRCodeEntry?: boolean;
  requiresVerifiedUser?: boolean;
};
type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
type EventPrivacy = 1 | 2 | 3;
type EventCategory = "MEETUP" | "GIG" | "DINNER" | "PRIVATE";
type EventMode = "IN_PERSON" | "ONLINE" | "HYBRID";
type EventLanguage = "EN" | "CA" | "ES" | "PT" | "IT" | "FR";
type EventLocation = {
  /** Street address */
  address1: string;
  /** locale address or neighbourhood */
  address2: string;
  /** town/city */
  town: string;
  /** postcode */
  postcode: string;
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
type EventPrice = {
  priceCents: number;
  /** For INTL, like EUR, GBP, USD etc */
  currencyCode: "EUR" | "GBP";
  canUseCredit: boolean;
};
type EventWaitingList = {
  /** ID of the user on the list */
  userId: string;
  /** UTC time when the user joined the queue */
  joinedAt: string;
};

export type MediaItem = {
  id: string;
  url: string;
  alt: string;
  mediaType: "IMAGE" | "VIDEO";
  featured?: boolean;
  createdTime: string;
};

type EventPromoModifier = {
  code: string;
  /** Ex: "50% off with this code" */
  description: string;
  /** 0.5 would be 50% off */
  modifier?: number;
  /** Type of action applied to the event when the code is entered by the user */
  action?: "EARLY_RSVP" | string;
  /** If false, code will be in-active */
  active: boolean;
  /** Optional UTC timestamp of when the code expires */
  codeExpiryTime?: string;
};

type EventRsvpResponseType = 'YES' | 'NO' | 'MAYBE';
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
  response: EventRsvpResponseType;
  /** Timestamp of initial RSVP */
  responseTimestamp: string;
  /** Timestamp of updated RSVP when most recently changed */
  responseTimestampUpdated: string;
  /** Incremental number of times the user has edited their RSVP */
  changedTimes: number;
}
/** Type for people responding to events */
export type EventRsvpResponse =
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
  /** If the user is a verified user (requires admin to set at an event) */
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
  role: UserRole;
  /** Profile info about the user - will be HTML */
  about: string;
  /** User's current location city in Spain. Ex: Barcelona */
  currentLocation: string;
  /** ID of the neighbourhood */
  barrioId: number;
  /** UTC of the time that the user arrived in BCN */
  arrivedInBarcelona: string;
  /** User's profile pic */
  profilePhoto: MediaItem[];
  /** List of tag-like interests that the user has, like hiking, photography, cycling, food etc */
  interests: string[];
  /** Number of RSVPs that the user has done up to now */
  completedRSVPs: number;
  /** List of Group IDs that the user is following */
  followingGroupIds: string[];
};

export type UserRole = "ADMIN" | "HOST" | "USER";

export type EventGroup = {
  /** The UUID group ID */
  groupId: string;
  /** The group display name */
  groupName: string;
  /** @todo - Unique public API key for the group */
  apiKey: string;
  /** If the group has been verified by us as being a real human group */
  isVerified: boolean;
  /** List of event IDs related to this group */
  eventIds: EventType["id"][];
  /** Profile photos for the groupd */
  profilePhoto: MediaItem[];
  /** HTML about the group */
  about: string;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** Tag-like list of topics and themes that the group is concerned with, such as: meetups, foreigners in BCN, english speaking, etc */
  topics: string[];
};
