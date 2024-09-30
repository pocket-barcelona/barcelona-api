import express, { Express, Request, Response } from "express";
import { MeetupController } from "../controller/meetup/meetup.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import { createMeetupSchema, updateMeetupSchema,deleteMeetupSchema,getMeetupByIdSchema,getMeetupByShortIdSchema } from "../schema/meetup/meetup.schema";
import { createResponseSchema, updateResponseSchema } from "../schema/meetup/rsvp.schema";
import requireMeetup from "../middleware/requireMeetup";
import { RsvpController } from "../controller/meetup/rsvp.controller";

const router = express.Router()

// ########### MEETUPS & RSVPs ###########

// @todo - ADMIN
router.get("/", [requireUser], MeetupController.getMeetupsListHandler);

// @todo - ADMIN - generate QR code for meetup
// @todo - ADMIN - validate QR code for this meetup (checks if user has rsvp'd as GOING etc)
// @todo - ADMIN - generate meetup invite link (temp or regenerate existing?)
// @todo - ADMIN - generate meetup promo code (all users) / voucher (for a specific user)
// @todo - ADMIN - approve user
// @todo - PUBLIC - read event QR code

/** Create new meetup */
router.post("/", [requireUser, validateResource(createMeetupSchema)], MeetupController.createMeetupHandler);
/** Get meetup by ID: requires user to be logged in */
router.get("/:eventId", [requireUser, validateResource(getMeetupByIdSchema)], MeetupController.getMeetupHandler);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get("/:eventId/public", [validateResource(getMeetupByIdSchema)], MeetupController.getNotLoggedInMeetupHandler);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get("/:eventShortId/short", [validateResource(getMeetupByShortIdSchema)], MeetupController.getMeetupByShortIdHandler);
/** Update meetup by ID */
router.patch("/:eventId", [requireUser, validateResource(updateMeetupSchema)], MeetupController.updateMeetupHandler);
/** Delete meetup by ID */
router.delete("/:eventId", [requireUser], MeetupController.deleteMeetupHandler);


// ########### RSVPS ###########
/** Create a new response to a meetup */
router.post("/:eventId/responses", [requireMeetup, validateResource(createResponseSchema)], RsvpController.createResponseHandler);
/** Update a response by ID */
router.patch("/:eventId/responses/:responseId", [requireMeetup, validateResource(updateResponseSchema)], RsvpController.updateResponseHandler);
/** Check if user has responded to this meetup yet */
router.post("/:eventId/has-responded", [requireMeetup], RsvpController.hasRespondedToEventAlreadyHandler);

// FUTURE:
// Follow meetup
// Review meetup
// Comment/chat on meetup
// Group admin: Send a message to all rsvp'd people (e.g. update to event location, etc)


export default router;
