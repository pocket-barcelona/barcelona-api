import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";

export interface EventInput {
  /** Internal Unique ID for the event from Google Sheets. Ex: 1, 2, 3 */
  eventId: string;
  /** Internal unique UUID for the event from Google Sheets */
  uuid: string;
  /** The official starting date for the event. Like 2024-01-14 */
  dateStart: Date;
  /** The official ending date for the event. Like 2024-01-14 */
  dateEnd: Date;
  /** Event type is like: Festa Major or Open Day / Weekend or Music Festival, etc */
  eventType: string;
  /** Enabled/disable events from being shown */
  eventActive: boolean;
  /** Whether or not the event recurs, e.g. next year. Note: this isn't accurate to the exact date next year! */
  eventRecurs: boolean;
  /** Google Calendar rule. @url https://developers.google.com/calendar/api/v3/reference/events#recurrence */
  recurrenceRule: string;
  /** The name of the event, in English */
  eventName: string;
  /** URL friendly pathname, like: `festa-major-de-sant-antoni-2022` */
  slug: string;
  /** The exact or approximate location of the event */
  location: string;
  /** Event lat */
  lat: number;
  /** Event lng */
  lng: number;
  /** 1 = Location is accurate to LAT/LNG. 2 = Location is accurate to Neighbourhood. 3 = Location is accurate to City */
  locationAccuracy: 1 | 2 | 3;
  /** True if is in BCN */
  isInBarcelona: boolean;
  /** The official website or URL for the event */
  url: string;
  /** Optional notes or remarks about the event */
  eventNotes: string;
}

export interface EventDocument extends Item, EventInput {
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new dynamoose.Schema({
  eventId: {
    type: String,
    required: true,
    hashKey: true,
  },
  uuid: {
    type: String,
    required: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  eventType: {
    type: String,
    required: true,
  },
  eventActive: {
    type: Boolean,
    required: true,
  },
  eventRecurs: {
    type: Boolean,
    required: true,
  },
  recurrenceRule: {
    type: String,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  location: {
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
  locationAccuracy: {
    type: Number,
    required: true,
  },
  isInBarcelona: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
    required: true,
    default: '',
  },
  eventNotes: {
    type: String,
    required: true,
    default: '',
  },
}, {
  timestamps: true,
  saveUnknown: false,
});

export const TABLE_NAME_EVENTS = 'Events';
const EventModel = dynamoose.model<EventDocument>(TABLE_NAME_EVENTS, eventSchema);

export default EventModel;
