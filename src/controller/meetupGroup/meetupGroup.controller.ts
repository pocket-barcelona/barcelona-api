import type { Request, Response } from "express";
import {
  createMeetupGroup,
  // deleteMeetupGroup,
  getMeetupGroupById,
  // getMeetupGroupList,
  updateMeetupGroup,
} from "./handlers";
import type { CreateMeetupGroupInput, DeleteMeetupGroupInput, UpdateMeetupGroupInput } from '../../schema/meetupGroup/meetupGroup.schema';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MeetupGroupController {
  static createMeetupGroupHandler = (
    req: Request<unknown, unknown, CreateMeetupGroupInput["body"]>,
    res: Response
  ) => createMeetupGroup(req, res);

  static getMeetupGroupHandler = (
    req: Request<UpdateMeetupGroupInput["params"]>,
    res: Response
  ) => getMeetupGroupById(req, res); // user logged in!

  // static getMeetupGroupListHandler = (req: Request, res: Response) =>
  //   getMeetupGroupList(req, res);

  static updateMeetupGroupHandler = (
    req: Request<
      UpdateMeetupGroupInput["params"],
      unknown,
      UpdateMeetupGroupInput["body"]
    >,
    res: Response
  ) => updateMeetupGroup(req, res);

  // static deleteMeetupGroupHandler = (
  //   req: Request<
  //     DeleteMeetupGroupInput["params"],
  //     unknown,
  //     UpdateMeetupGroupInput["body"]
  //   >,
  //   res: Response
  // ) => deleteMeetupGroup(req, res);
}
