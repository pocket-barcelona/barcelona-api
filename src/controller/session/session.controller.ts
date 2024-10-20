import type { Request, Response } from "express";
import type { SessionInput } from "../../schema/session/session.schema";
import {
  createSession,
  deleteSession,
  getSessions,
  refreshSession,
} from "./handlers";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SessionController {
  static createSessionHandler = (
    req: Request<unknown, unknown, SessionInput["body"]>,
    res: Response
  ) => createSession(req, res);

  static deleteSessionHandler = (req: Request, res: Response) =>
    deleteSession(req, res);

  static getSessionsHandler = (req: Request, res: Response) =>
    getSessions(req, res);

  static refreshSessionHandler = (req: Request, res: Response) =>
    refreshSession(req, res);

}
