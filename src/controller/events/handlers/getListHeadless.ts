import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { CalendarService } from "../../../service/calendar/calendar.service";

/**
 * @deprecated
 * Get a list of calendar events from Directus
 * @param req
 * @param res
 * @returns
 */
export default async function getListHeadless(req: Request, res: Response) {
  
  const data = await CalendarService.getHeadlessList();

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
