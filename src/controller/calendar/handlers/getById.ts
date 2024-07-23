import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { CalendarService } from "../../../service/calendar/calendar.service";
import type { ReadCalendarEventInput } from '../../../schema/calendar/calendar.schema';

/**
 * Get a calendar item by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(req: Request<ReadCalendarEventInput['params']>, res: Response) {
  if (!req.params.calendarEventId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Please provide a calendarEventId", res.statusCode));
  }

  const { calendarEventId: id } = req.params;
  const record = await CalendarService.getById(id);

  if (!record) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(record));
}
