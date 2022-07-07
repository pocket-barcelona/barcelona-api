import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";


export interface EventInput {
  /** Unique ID number for the event */
  eventId: number;
  /** The official starting date for the event */
  dateStart: number;
  /** The official ending date for the event */
  dateEnd: number;
  /** The name of the event, in English */
  eventName: string;
  /** The exact or approximate location of the event */
  location: string;
  /** Whether or not the event recurs, e.g. next year */
  recurs: boolean;
  /** The official website or URL for the event */
  url: string;
  /** Optional notes or remarks about the event */
  notes: string;
}

export interface EventDocument extends EventInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new dynamoose.Schema({
  eventId: {
    type: Number,
    required: true,
    hashKey: true,
  },
  dateStart: {
    type: Date,
    required: true,
  },
  dateEnd: {
    type: Date,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  recurs: {
    type: Boolean,
    required: true,
    default: false,
  },
  url: {
    type: String,
    required: true,
    default: '',
  },
  notes: {
    type: String,
    required: true,
    default: '',
  },
}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME = 'Events';
const EventModel = dynamoose.model<EventDocument>(TABLE_NAME, eventSchema);

export default EventModel;
