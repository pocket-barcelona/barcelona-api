import { v4 as uuidv4 } from 'uuid';
import type { CreateMeetupGroupInput } from '../../../schema/meetupGroup/meetupGroup.schema';
import type { MeetupGroupDocument, MeetupGroupItem } from '../../../models/meetupGroup.model';
import MeetupGroupModel from '../../../models/meetupGroup.model';

export default async function create(
  input: CreateMeetupGroupInput["body"],
  hostId: string
): Promise<MeetupGroupDocument | null | string> {
  
  const { about, groupName, groupLocation } = input;
  try {
    
    const newGroup: MeetupGroupItem = {
      about,
      groupName,
      groupLocation,
      ownerId: hostId,
      groupId: uuidv4(), // auto-generate for the group
      apiKey: uuidv4(), // auto-generate for the group
      isVerified: false,
      meetupIds: [],
      profilePhoto: [],
      topics: [],
      signupDate: new Date(),
      lastLogin: new Date(),
    }
    
    const result = await MeetupGroupModel.create(newGroup).catch((err) => {
      if (err?.message) return err.message;
      return null;
    });

    return result;
  } catch (err: unknown) {
    // post values were malformed
    return null;
  }
}
