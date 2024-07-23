import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { CalendarService } from "../../../service/calendar/calendar.service";

/**
 * Get a list of calendar events
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  
  const data = await CalendarService.getList();

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
