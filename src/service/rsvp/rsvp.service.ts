import type { MeetupDocument } from "../../models/meetup.model";
import type {
  CreateRsvpInput,
  UpdateRsvpInput,
} from "../../schema/meetup/rsvp.schema";
import type { MeetupRsvpModel } from "../../models/rsvp.model";
import type { UserDocument } from "../../models/auth/user.model";
import {
  createRsvpHandler,
  updateRsvpHandler,
  hasRsvpdToMeetupYetHandler,
  notifyMeetupHostHandler,
} from "./functions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RsvpService {
  static createRsvp = async (
    theEvent: MeetupDocument,
    input: CreateRsvpInput,
    userId: string
  ): Promise<MeetupRsvpModel | null> =>
    createRsvpHandler(theEvent, input, userId);

  static updateResponse = async (
    theEvent: MeetupDocument,
    input: UpdateRsvpInput,
    userId: string
  ): Promise<MeetupRsvpModel | null> =>
    updateRsvpHandler(theEvent, input, userId);

  static hasRsvpdToMeetupYet = async (
    theEvent: MeetupDocument,
    userId: UserDocument["userId"],
    responseId: MeetupRsvpModel["rsvpId"]
  ): Promise<MeetupRsvpModel["rsvpId"]> =>
    hasRsvpdToMeetupYetHandler(theEvent, userId, responseId);

  static notifyMeetupHost = async (
    theEvent: MeetupDocument,
    data: { name: string; response: string; comment: string; hostEmail: string }
  ): Promise<{
    success: boolean;
    error: string;
  }> => notifyMeetupHostHandler(theEvent, data);
}
