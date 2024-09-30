import dynamoose from "dynamoose";
import type { Item } from 'dynamoose/dist/Item';
import { questionSchema } from './poll.types';
// import { EventResponseModel } from "./event-responses.model";
// import { PollQuestions, PollQuestionsInput, PollResults, questionSchema } from "./types/poll.types";

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
export interface MeetupInput {
  id: string;
  shortId: string;
  hostId: string;
  activityDescription: string;
  dateDescription: string;
  location: string;
  notes: string;
  startTime: Date;
  endTime: Date;
  // pollQuestions: PollQuestionsInput;
}
export interface MeetupDocument extends MeetupInput, Item {
  createdAt: Date;
  updatedAt: Date;
  status: MeetupStatusEnum
  // responses: Array<EventResponseModel>;
  // hostName?: string;
  // hostAvatarColor?: string;
  // pollQuestions: PollQuestions;
  // pollResults?: PollResults
}

export const meetupConfigSchema = new dynamoose.Schema({
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

export const locationSchema = new dynamoose.Schema({
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

export const priceSchema = new dynamoose.Schema({
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

export const rsvpSchema = new dynamoose.Schema({
  rsvpId: {
    type: String,
    required: true,
  },
  attendeeUserId: {
    type: String,
    required: true,
  },
  attendanceStatus: {
    type: Number,
    required: true,
  },
  attendeeName: {
    type: String,
    required: true,
  },
  attendeeAvatarColor: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const meetupSchema = new dynamoose.Schema({
  id: {
    type: String,
    required: true,
    hashKey: true,
  },
  groupId: { // the person/group hosting the event/meetup
    type: String,
    required: true,
  },
  clonedId: {
    type: String,
    required: true,
  },
  shortId: {
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
  },
  endTime: {
    type: Date,
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
  rsvps: {
    type: Array,
    schema: [rsvpSchema],
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



export const MEETUP_TABLE_NAME = 'Meetup';
const MeetupModel = dynamoose.model<MeetupDocument>(MEETUP_TABLE_NAME, meetupSchema);

export default MeetupModel;
