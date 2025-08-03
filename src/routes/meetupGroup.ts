import express from "express";
import { MeetupGroupController } from "../controller/meetupGroup/meetupGroup.controller";
import requireAdmin from "../middleware/requireAdmin";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";
import {
	createMeetupGroupSchema,
	deleteMeetupGroupSchema,
	getMeetupGroupByIdSchema,
	updateMeetupGroupSchema,
} from "../schema/meetupGroup/meetupGroup.schema";

const router = express.Router();

// ########### MEETUPS GROUPS ###########

// @todo - ADMIN
router.get(
	"/",
	[requireUser, requireAdmin],
	MeetupGroupController.getMeetupGroupListHandler,
);

// @todo - ADMIN - generate QR code for meetup
// @todo - ADMIN - validate QR code for this meetup (checks if user has rsvp'd as GOING etc)
// @todo - ADMIN - generate meetup invite link (temp or regenerate existing?)
// @todo - ADMIN - generate meetup promo code (all users) / voucher (for a specific user)
// @todo - ADMIN - approve user
// @todo - PUBLIC - read event QR code

/** Create a new group */

router.post(
	"/",
	[requireUser, requireAdmin, validateResource(createMeetupGroupSchema)],
	MeetupGroupController.createMeetupGroupHandler,
);

/** Get group by ID: requires user to be logged in */
router.get(
	"/:groupId",
	[validateResource(getMeetupGroupByIdSchema)],
	MeetupGroupController.getMeetupGroupHandler,
);

// /** Get public info about the group (user doesn't need to be logged in or have an account) */
// router.get(
//   "/:eventId/public",
//   [validateResource(getMeetupByIdSchema)],
//   MeetupGroupController.getNotLoggedInMeetupHandler
// );

/** Update group by ID */
router.patch(
	"/:groupId",
	[requireUser, validateResource(updateMeetupGroupSchema)],
	MeetupGroupController.updateMeetupGroupHandler,
);

// /** Delete meetup by ID */
// router.delete("/:eventId", [requireUser], MeetupGroupController.deleteMeetupHandler);

// FUTURE:
// Group admin: Send a message to all rsvp'd people (e.g. update to event location, etc)

export default router;
