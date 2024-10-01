import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import { genericMediaAssetSchema, type GenericMediaItem } from "./imageAssets";
import type { MeetupItem } from "./meetup.model";

export interface MeetupGroupItem {
  /** The group ID */
  id: string;
  /** The group display name */
  groupName: string;
  /** @todo - Unique public API key for the group */
  apiKey: string;
  /** If the group has been verified by us as being a real human group */
  isVerified: boolean;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** List of meetup IDs related to this group */
  meetupIds: MeetupItem["meetupId"][];
  /** Profile photos for the groupd */
  profilePhoto: GenericMediaItem[];
  /** HTML about the group */
  about: string;
  /** Tag-like list of topics and themes that the group is concerned with, such as: meetups, foreigners in BCN, english speaking, etc */
  topics: string[];
}
export interface MeetupGroupDocument extends Item, MeetupGroupItem {
  createdAt: Date;
  updatedAt: Date;
}

const meetupGroupSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      required: true,
      hashKey: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    signupDate: {
      type: Date,
      required: true,
    },
    lastLogin: {
      type: Date,
      required: true,
    },
    meetupIds: {
      type: Array,
      required: true,
      schema: [String],
    },
    profilePhoto: {
      type: Array,
      required: true,
      schema: [genericMediaAssetSchema],
    },
    about: {
      type: String,
      required: true,
    },
    topics: {
      type: Array,
      required: true,
      schema: [String],
    },
  },
  {
    timestamps: true,
    saveUnknown: false,
  }
);

export const MEETUP_GROUPS_TABLE_NAME = "Meetup_Groups";
const MeetupGroupModel = dynamoose.model<MeetupGroupDocument>(
  MEETUP_GROUPS_TABLE_NAME,
  meetupGroupSchema
);

export default MeetupGroupModel;
