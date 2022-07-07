import express, { Express, Request, Response } from "express";
import { EventsController } from "../controller/events/events.controller";
// import requireUser from "../middleware/requireUser";
const router = express.Router()


// ########### EVENTS ###########
router.get("/", [], EventsController.getListHandler);

export default router;
