import type { Query, ScanResponse } from "dynamoose/dist/ItemRetriever";
import type {
  MeetupGroupDocument,
  MeetupGroupItem,
} from "../../models/meetupGroup.model";
import type {
  CreateMeetupGroupInput,
  UpdateMeetupGroupInput,
} from "../../schema/meetupGroup/meetupGroup.schema";
import {
  createHandler,
  getListHandler,
  getByIdHandler,
  updateHandler,
  // deleteByIdHandler,
} from "./functions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MeetupGroupService {

  static create = async (
    input: CreateMeetupGroupInput["body"],
    hostId: string
  ): Promise<MeetupGroupDocument | null | string> => createHandler(input, hostId);

  static getMeetupGroups = async (
    hostId: MeetupGroupDocument["groupId"]
  ): Promise<ScanResponse<MeetupGroupDocument> | null> => getListHandler(hostId);

  static getById = async (
    input: Pick<MeetupGroupItem, "groupId"> & { loggedIn?: boolean }
  ): Promise<MeetupGroupDocument | Partial<MeetupGroupDocument> | null> =>
    getByIdHandler(input);

  static update = async (
    eventId: MeetupGroupItem["groupId"],
    input: UpdateMeetupGroupInput["body"]
  ): Promise<MeetupGroupDocument | null> => updateHandler(eventId, input);

  // static deleteById = async (
  //   theEvent: MeetupGroupDocument,
  //   newStatus: MeetupGroupStatusEnum
  // ): Promise<string | null | undefined> =>
  //   deleteByIdHandler(theEvent, newStatus);
}
