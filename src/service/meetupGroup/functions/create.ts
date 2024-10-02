import { v4 as uuidv4 } from 'uuid';
import type { CreateMeetupGroupInput } from '../../../schema/meetupGroup/meetupGroup.schema';
import type { MeetupGroupDocument, MeetupGroupItem } from '../../../models/meetupGroup.model';
import MeetupGroupModel from '../../../models/meetupGroup.model';

export default async function create(
  input: CreateMeetupGroupInput["body"],
  hostId: string
): Promise<MeetupGroupDocument | null | string> {
  
  const { about, groupName } = input;
  try {
    
    const newGroup: MeetupGroupItem = {
      about,
      groupName,
      ownerId: hostId,
      groupId: uuidv4(),
      apiKey: uuidv4(),
      isVerified: false,
      meetupIds: [],
      profilePhoto: [],
      topics: [],
      signupDate: new Date(),
      lastLogin: new Date(),
    }
    
    const result = await MeetupGroupModel.create(newGroup).catch((err) => {
      // logger.warn(err);
      // timer({ ...metricsLabels, success: "false" });
      // return a validation error if present
      if (err?.message) return err.message;
      return null;
    });

    // timer({ ...metricsLabels, success: "true" });
    return result;
  } catch (err: unknown) {
    // post values were malformed
    // timer({ ...metricsLabels, success: "false" });
    // throw e;
    return null;
  }
}
