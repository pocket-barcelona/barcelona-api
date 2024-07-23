import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { EventsService } from "../../../service/events/events.service";
import type { ReadEventInput } from '../../../schema/event/event.schema';

/**
 * Get an event by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(req: Request<ReadEventInput['params']>, res: Response) {
  if (!req.params.eventId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Please provide an event ID", res.statusCode));
  }

  const eventId = Number(req.params.eventId);
  const record = await EventsService.getById(eventId);

  if (!record) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(record));
}
