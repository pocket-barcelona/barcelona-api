import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import {
  genericMediaAssetSchema,
  type GenericMediaItem,
} from "./imageAssets.model";
import type { MeetupItem } from "./meetup.model";

export interface MeetupGroupItem {
  /** The group ID */
  groupId: string;
  /** Unique slug for the group, like my-amazing-meetup */
  slug: string;
  /** The user ID of the group creator */
  ownerId: string;
  /** @todo - we need a list of meetup group owners - separate table? */
  /** The group display name */
  groupName: string;
  /** Will be like Spain, Barcelona or Poblenou, depending on what the group wants to show */
  groupLocation: string;
  /** @todo - Unique public API key for the group */
  apiKey: string;
  /** If the group has been verified by us as being a real human group */
  isVerified: boolean;
  /** Show/hide the group in a public listing */
  isPublic: boolean;
  /** UTC of when user signed up */
  signupDate: Date;
  /** UTC of user's last logged-in time */
  lastLogin: Date;
  /** List of meetup IDs related to this group */
  meetupIds: MeetupItem["meetupId"][];
  /** Logo for the meetup group - main logo will be featured=true */
  logo: GenericMediaItem[];
  /** Profile photos for the group */
  profilePhoto: GenericMediaItem[];
  /** HTML about the group */
  about: string;
  /** If paid event refund link visited, a block of HTML about how it works for this group */
  refundPolicy: string;
  /** Social media info for the group */
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    telegram: string;
    tiktok: string;
    twitter: string;
    website: string;
    whatsapp: string;
    youtube: string;
    bizum: string;
  };
  /** Like Europe/Madrid */
  timezone: string;
  /** Tag-like list of topics and themes that the group is concerned with, such as: meetups, foreigners in BCN, english speaking, etc */
  topics: string[];
  /** @todo */
  // eventsHostedCount: number;
}
export interface MeetupGroupDocument extends Item, MeetupGroupItem {
  createdAt: Date;
  updatedAt: Date;
}

const meetupGroupSchema = new dynamoose.Schema(
  {
    groupId: {
      type: String,
      required: true,
      hashKey: true,
    },
    slug: {
      type: String,
      required: true,
    },
    ownerId: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    groupLocation: {
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
    isPublic: {
      type: Boolean,
      required: true,
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
      schema: [
        {
          type: String,
        },
      ],
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
    refundPolicy: {
      type: String,
      required: true,
    },
    social: {
      type: Object,
      required: true,
      schema: {
        facebook: {
          type: String,
        },
        instagram: {
          type: String,
        },
        whatsapp: {
          type: String,
        },
        telegram: {
          type: String,
        },
        linkedin: {
          type: String,
        },
        tiktok: {
          type: String,
        },
        twitter: {
          type: String,
        },
        website: {
          type: String,
        },
        youtube: {
          type: String,
        },
        bizum: {
          type: String,
        },
      },
    },
    timezone: {
      type: String,
      required: true,
    },
    topics: {
      type: Array,
      required: true,
      schema: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
    saveUnknown: [
      "social.*",
    ],
  }
);

export const MEETUP_GROUPS_TABLE_NAME = "Meetup_Groups";
const MeetupGroupModel = dynamoose.model<MeetupGroupDocument>(
  MEETUP_GROUPS_TABLE_NAME,
  meetupGroupSchema
);

export default MeetupGroupModel;
