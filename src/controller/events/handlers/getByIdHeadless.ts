import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { CalendarService } from "../../../service/calendar/calendar.service";
import type { ReadCalendarEventInput } from '../../../schema/event/calendar.schema';

/**
 * @deprecated
 * Get a calendar item by ID from Directus
 * @param req
 * @param res
 * @returns
 */
export default async function getByIdHeadless(req: Request<ReadCalendarEventInput['params']>, res: Response) {
  if (!req.params.id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Please provide an id", res.statusCode));
  }

  const { id } = req.params;
  const record = await CalendarService.getByHeadlessId(id);

  if (!record) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }

  return res.send(success(record));
}
