import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import GoogleCalendarService, { OLDEST_PB_EVENT } from "../../../service/calendar/googleCalendar.service";

/**
 * Get a list of Google calendar events
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  
  const data = await GoogleCalendarService.listEvents(OLDEST_PB_EVENT, 100);

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting Google list", res.statusCode));
  }

  return res.send(success(data));
}
