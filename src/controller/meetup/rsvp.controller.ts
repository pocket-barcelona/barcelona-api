import type { Request, Response } from "express";
import type {
  CreateResponseInput,
  UpdateResponseInput,
} from "../../schema/meetup/rsvp.schema";
import {
  createResponse,
  updateResponse,
  hasRespondedToEventAlready,
} from "./handlers/rsvp";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class RsvpController {
  static createResponseHandler = (
    req: Request<
      CreateResponseInput["params"],
      unknown,
      CreateResponseInput["body"]
    >, // the event already exists, so we need the ID from the request
    res: Response
  ) => createResponse(req, res);

  static hasRespondedToEventAlreadyHandler = (
    req: Request<
      CreateResponseInput["params"],
      unknown,
      {
        responseId: string;
      }
    >,
    res: Response
  ) => hasRespondedToEventAlready(req, res);

  static updateResponseHandler = (
    req: Request<
      UpdateResponseInput["params"],
      unknown,
      CreateResponseInput["body"]
    >, // the event already exists, so we need the ID from the request
    res: Response
  ) => updateResponse(req, res);
}
