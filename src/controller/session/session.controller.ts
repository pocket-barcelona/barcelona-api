import { Request, Response } from "express";
import { SessionInput } from "../../schema/session/session.schema";
import {
  createSession,
  deleteSession,
  getSessions,
  refreshSession,
} from "./handlers";

export class SessionController {
  static createSessionHandler = (
    req: Request<{}, {}, SessionInput["body"]>,
    res: Response
  ) => createSession(req, res);

  static deleteSessionHandler = (req: Request, res: Response) =>
    deleteSession(req, res);

  static getSessionsHandler = (req: Request, res: Response) =>
    getSessions(req, res);

  static refreshSessionHandler = (req: Request, res: Response) =>
    refreshSession(req, res);

}
