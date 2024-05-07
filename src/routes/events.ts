import express, { Express, Request, Response } from "express";
import { EventsController } from "../controller/events/events.controller";
import { readEventSchema } from '../schema/event/event.schema';
import validateResource from '../middleware/validateResource';
// import requireUser from "../middleware/requireUser";
const router = express.Router()


// ########### EVENTS ###########
router.get("/", [], EventsController.getListHandler);

router.get("/:eventId", [validateResource(readEventSchema)], EventsController.getByIdHandler);

export default router;
