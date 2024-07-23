import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { CalendarService } from "../../../service/calendar/calendar.service";
import GoogleCalendarService from "../../../service/calendar/googleCalendar.service";

/**
 * Sync all calendar events from Directus to Google Calendar
 * @param req
 * @param res
 * @returns
 */
export default async function syncEvents(req: Request, res: Response) {
  // TODO - for each event or do as batch?!
  
  const data = await GoogleCalendarService.insertEvent();

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
