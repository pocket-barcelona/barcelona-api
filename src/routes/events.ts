import express, { Express, Request, Response } from "express";
import { readCalendarEventSchema } from '../schema/event/calendar.schema';
import { EventsController } from "../controller/events/events.controller";
import { readEventSchema } from '../schema/event/event.schema';
import validateResource from '../middleware/validateResource';
import requireUser from "../middleware/requireUser";
const router = express.Router()


// ########### EVENTS ###########
router.get("/", [], EventsController.getListHandler);

router.get("/:eventId", [validateResource(readEventSchema)], EventsController.getByIdHandler);

router.get("/aws/sync", [requireUser], EventsController.syncToDynamoHandler);

// ########### CALENDAR ###########

// get events from Directus
router.get("/calendar/headless", [], EventsController.getListHandler);

// id=Directus internal ID (same as Sheets ID)
router.get("/calendar/headless/:id", [validateResource(readCalendarEventSchema)], EventsController.getByIdHandler);

router.get("/calendar/google/sync", [requireUser], EventsController.syncToGoogleCalendarHandler);

router.get("/calendar/google", [requireUser], EventsController.getGoogleCalendarListHandler);

// id=Google calendar ID
router.get("/calendar/google/id/:id", [requireUser, validateResource(readCalendarEventSchema)], EventsController.getGoogleCalendarEventByIdHandler);

// id=Google calendar ID
router.get("/calendar/google/id/:id/instances", [requireUser, validateResource(readCalendarEventSchema)], EventsController.getGoogleCalendarEventInstancesHandler);

// id=iCalUID
router.get("/calendar/google/ical/:id", [requireUser, validateResource(readCalendarEventSchema)], EventsController.getGoogleCalendarEventByIcalUidHandler);


export default router;
