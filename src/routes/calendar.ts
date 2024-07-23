import express, { Express, Request, Response } from "express";
import { CalendarController } from "../controller/calendar/calendar.controller";
import { readCalendarEventSchema } from '../schema/calendar/calendar.schema';
import validateResource from '../middleware/validateResource';
import requireUser from '../middleware/requireUser';
const router = express.Router()


// ########### CALENDAR ###########
router.get("/", [], CalendarController.getListHandler);

router.get("/sync", [requireUser], CalendarController.syncAllHandler);

router.get("/:calendarEventId", [validateResource(readCalendarEventSchema)], CalendarController.getByIdHandler);

export default router;
