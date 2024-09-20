import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { ReadCalendarEventInput } from '../../../schema/event/calendar.schema';
import GoogleCalendarService from "../../../service/calendar/googleCalendar.service";

/**
 * Get a google calendar item by iCalUID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(req: Request<ReadCalendarEventInput['params']>, res: Response) {
  if (!req.params.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Please provide an id - must be an iCalUID", res.statusCode));
  }

  const { id } = req.params;
  const record = await GoogleCalendarService.getEventByUID(id);

  if (!record) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(record));
}
