import express, { Express, Request, Response } from "express";
import { CalendarController } from "../controller/calendar/calendar.controller";
import { readCalendarEventSchema } from '../schema/calendar/calendar.schema';
import validateResource from '../middleware/validateResource';
import requireUser from '../middleware/requireUser';
const router = express.Router()


// ########### CALENDAR ###########
router.get("/headless", [], CalendarController.getListHandler);

router.get("/headless/:calendarEventId", [validateResource(readCalendarEventSchema)], CalendarController.getByIdHandler);

router.get("/google/sync", [requireUser], CalendarController.syncToGoogleCalendarHandler);

router.get("/google", [requireUser], CalendarController.getGoogleCalendarListHandler);

router.get("/google/:calendarEventId", [requireUser, validateResource(readCalendarEventSchema)], CalendarController.getGoogleCalendarEventByIdHandler);


export default router;
