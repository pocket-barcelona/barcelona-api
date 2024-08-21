import express, { Express, Request, Response } from "express";
import { CalendarController } from "../controller/calendar/calendar.controller";
import { readCalendarEventSchema } from '../schema/calendar/calendar.schema';
import validateResource from '../middleware/validateResource';
import requireUser from '../middleware/requireUser';
const router = express.Router()


// ########### CALENDAR ###########
router.get("/headless", [], CalendarController.getListHandler);

// id=Directus internal ID
router.get("/headless/:id", [validateResource(readCalendarEventSchema)], CalendarController.getByIdHandler);

router.get("/google/sync", [requireUser], CalendarController.syncToGoogleCalendarHandler);

router.get("/google", [requireUser], CalendarController.getGoogleCalendarListHandler);

// id=Google calendar ID
router.get("/google/id/:id", [requireUser, validateResource(readCalendarEventSchema)], CalendarController.getGoogleCalendarEventByIdHandler);

// id=Google calendar ID
router.get("/google/id/:id/instances", [requireUser, validateResource(readCalendarEventSchema)], CalendarController.getGoogleCalendarEventInstancesHandler);

// id=iCalUID
router.get("/google/ical/:id", [requireUser, validateResource(readCalendarEventSchema)], CalendarController.getGoogleCalendarEventByIcalUidHandler);


export default router;
