import dynamoose from "dynamoose";
import type { Item } from 'dynamoose/dist/Item';
import { rsvpSchema } from './rsvp.model';
import type { GenericMediaItem } from './imageAssets';
import type { MeetupItem } from './meetup.types';

export interface MeetupGroupInput {
  /** The group display name */
  groupName: string;
  /** Profile photos for the groupd */
  profilePhoto: GenericMediaItem[];
  /** HTML about the group */
  about: string;
  
  /** Tag-like list of topics and themes that the group is concerned with, such as: meetups, foreigners in BCN, english speaking, etc */
  topics: string[];
}
export interface MeetupGroupDocument extends MeetupGroupInput, Item {
  createdAt: Date;
  updatedAt: Date;

  /** The UUID group ID */
  groupId: string;
  /** @todo - Unique public API key for the group */
  apiKey: string;
  /** If the group has been verified by us as being a real human group */
  isVerified: boolean;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** List of event IDs related to this group */
  eventIds: MeetupItem["id"][];
}

const meetupGroupSchema = new dynamoose.Schema({
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
  
}, {
  timestamps: true,
  saveUnknown: false,
});



export const MEETUP_GROUPS_TABLE_NAME = 'Meetup_Groups';
const MeetupGroupsModel = dynamoose.model<MeetupGroupDocument>(MEETUP_GROUPS_TABLE_NAME, meetupGroupSchema);

export default MeetupGroupsModel;
