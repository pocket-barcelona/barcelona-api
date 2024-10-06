import express, { Express, Request, Response } from "express";
import { MeetupController } from "../controller/meetup/meetup.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
  createMeetupSchema,
  updateMeetupSchema,
  deleteMeetupSchema,
  getMeetupByIdSchema,
  getMeetupByShortIdSchema,
} from "../schema/meetup/meetup.schema";
import {
  createRsvpSchema,
  updateRsvpSchema,
} from "../schema/meetup/rsvp.schema";
import requireMeetup from "../middleware/requireMeetup";
import { RsvpController } from "../controller/meetup/rsvp.controller";
import requireAdmin from "../middleware/requireAdmin";

const router = express.Router();

// ########### MEETUPS & RSVPs ###########

router.get(
  "/",
  [requireAdmin, requireUser],
  MeetupController.getMeetupsListHandler
);

/** Create a new meetup */
router.post(
  "/",
  [requireUser, validateResource(createMeetupSchema)],
  MeetupController.createMeetupHandler
);
/** Get meetup by ID: requires user to be logged in */
router.get(
  "/:meetupId",
  [requireUser, validateResource(getMeetupByIdSchema)],
  MeetupController.getMeetupHandler
);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get(
  "/:meetupId/public",
  [validateResource(getMeetupByIdSchema)],
  MeetupController.getNotLoggedInMeetupHandler
);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get(
  "/:meetupShortId/short",
  [validateResource(getMeetupByShortIdSchema)],
  MeetupController.getMeetupByShortIdHandler
);
/** Update meetup by ID */
router.patch(
  "/:meetupId",
  [requireUser, validateResource(updateMeetupSchema)],
  MeetupController.updateMeetupHandler
);
/** Delete meetup by ID */
router.delete("/:meetupId", [requireUser], MeetupController.deleteMeetupHandler);

// ########### RSVPS ###########
/** Create a new response to a meetup */
router.post(
  "/:meetupId/responses",
  [requireMeetup, validateResource(createRsvpSchema)],
  RsvpController.createRsvpHandler
);
/** Update a response by ID */
router.patch(
  "/:meetupId/responses/:responseId",
  [requireMeetup, validateResource(updateRsvpSchema)],
  RsvpController.updateRsvpHandler
);
/** Check if user has responded to this meetup yet */
router.post(
  "/:meetupId/has-responded",
  [requireMeetup],
  RsvpController.hasRsvpdToMeetupAlreadyHandler
);

// FUTURE:
// Follow meetup
// Review meetup
// Comment/chat on meetup

export default router;
