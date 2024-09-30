import type { MeetupDocument } from "../../models/meetup.model";
import type {
  CreateResponseInput,
  UpdateResponseInput,
} from "../../schema/meetup/rsvp.schema";
import type { EventResponseModel } from "../../models/rsvp.model";
import type { UserDocument } from "../../models/auth/user.model";
import {
  createResponseHandler,
  updateResponseHandler,
  hasRespondedToEventYetHandler,
  notifyEventHostHandler,
} from "./functions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ResponseService {
  static createResponse = async (
    theEvent: MeetupDocument,
    input: CreateResponseInput,
    userId: string
  ): Promise<EventResponseModel | null> =>
    createResponseHandler(theEvent, input, userId);

  static updateResponse = async (
    theEvent: MeetupDocument,
    input: UpdateResponseInput,
    userId: string
  ): Promise<EventResponseModel | null> =>
    updateResponseHandler(theEvent, input, userId);

  static hasRespondedToEventYet = async (
    theEvent: MeetupDocument,
    userId: UserDocument["userId"],
    responseId: EventResponseModel["responseId"]
  ): Promise<EventResponseModel["responseId"]> =>
    hasRespondedToEventYetHandler(theEvent, userId, responseId);

  static notifyEventHost = async (
    theEvent: MeetupDocument,
    data: { name: string; response: string; comment: string; hostEmail: string }
  ): Promise<{
    success: boolean;
    error: string;
  }> => notifyEventHostHandler(theEvent, data);
}
