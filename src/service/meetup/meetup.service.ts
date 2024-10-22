import type { Query, ScanResponse } from "dynamoose/dist/ItemRetriever";
import type {
  MeetupDocument,
  MeetupItem,
  MeetupStatusEnum,
} from "../../models/meetup.model";
import type {
  CreateMeetupInput,
  UpdateMeetupInput,
} from "../../schema/meetup/meetup.schema";
import {
  createHandler,
  searchHandler,
  getListHandler,
  getByIdHandler,
  getByShortIdHandler,
  updateHandler,
  deleteByIdHandler,
} from "./functions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MeetupService {

  static create = async (
    input: CreateMeetupInput["body"],
    userId: string
  ): Promise<MeetupDocument | null | string> => createHandler(input, userId);

  static search = async (
    query: Query<MeetupDocument>
  ): Promise<Query<MeetupDocument>> => searchHandler(query);

  static getMeetups = async (
    groupId: MeetupDocument["groupId"]
  ): Promise<ScanResponse<MeetupDocument> | null> => getListHandler(groupId);

  static getById = async (
    input: Pick<MeetupItem, "meetupId"> & { loggedIn?: boolean }
  ): Promise<MeetupDocument | Partial<MeetupDocument> | null> =>
    getByIdHandler(input);

  static getByShortId = async (
    input: Pick<MeetupItem, "shortId">
  ): Promise<MeetupDocument | Partial<MeetupDocument> | null> =>
    getByShortIdHandler(input);

  static update = async (
    eventId: MeetupItem["meetupId"],
    input: UpdateMeetupInput["body"]
  ): Promise<MeetupDocument | null> => updateHandler(eventId, input);

  static deleteById = async (
    theEvent: MeetupDocument,
    newStatus: MeetupStatusEnum
  ): Promise<string | null | undefined> =>
    deleteByIdHandler(theEvent, newStatus);
}
