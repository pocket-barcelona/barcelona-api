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
  
  // const data = await GoogleCalendarService.insertEvent();
  // const data = await GoogleCalendarService.listEvents();
  // const data = await GoogleCalendarService.getEvent('_6srm8e1m6os36bb5ccsjeb9k6sqj6b9p61h68bb66so36d9n75gj4d326c');
  const data = await GoogleCalendarService.getEventByUID('77d86683-ec97-4753-90bd-f703579a24b3');
  
  
  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
