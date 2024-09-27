import type { Request, Response } from "express";
import type {
  CreateMeetupInput,
  DeleteMeetupInput,
  ReadMeetupByIdInput,
  ReadMeetupByShortIdInput,
  UpdateMeetupInput,
} from "../../schema/meetup/meetup.schema";
import {
  createMeetup,
  deleteMeetup,
  getMeetupById,
  getMeetupByShortId,
  getMeetupsList,
  updateMeetup,
} from "./handlers";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MeetupController {
  static createMeetupHandler = (
    req: Request<unknown, unknown, CreateMeetupInput["body"]>,
    res: Response
  ) => createMeetup(req, res);

  static deleteMeetupHandler = (
    req: Request<DeleteMeetupInput["params"], unknown, UpdateMeetupInput["body"]>,
    res: Response
  ) => deleteMeetup(req, res);

  static getMeetupHandler = (
    req: Request<UpdateMeetupInput["params"]>,
    res: Response
  ) => getMeetupById(req, res); // user logged in!

  static getNotLoggedInMeetupHandler = (
    req: Request<ReadMeetupByIdInput["params"]>,
    res: Response
  ) => getMeetupById(req, res, false); // user not logged in!

  static getMeetupByShortIdHandler = (
    req: Request<ReadMeetupByShortIdInput["params"]>,
    res: Response
  ) => getMeetupByShortId(req, res);

  static getMeetupsListHandler = (req: Request, res: Response) =>
    getMeetupsList(req, res);

  static updateMeetupHandler = (
    req: Request<UpdateMeetupInput["params"], unknown, UpdateMeetupInput["body"]>,
    res: Response
  ) => updateMeetup(req, res);
}
