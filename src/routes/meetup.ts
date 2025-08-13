import express from 'express';
import { MeetupController } from '../controller/meetup/meetup.controller.js';
import { RsvpController } from '../controller/meetup/rsvp.controller.js';
import requireAdmin from '../middleware/requireAdmin.js';
import requireCanRsvp from '../middleware/requireCanRsvp.js';
import requireMeetup from '../middleware/requireMeetup.js';
import requireUser from '../middleware/requireUser.js';
import validateResource from '../middleware/validateResource.js';
import {
	createMeetupSchema,
	deleteMeetupSchema,
	getMeetupByIdSchema,
	getMeetupByShortIdSchema,
	getMeetupsByGroupIdSchema,
	updateMeetupSchema,
} from '../schema/meetup/meetup.schema.js';
import { createRsvpSchema, updateRsvpSchema } from '../schema/meetup/rsvp.schema.js';

const router = express.Router();

// ########### MEETUPS & RSVPs ###########

router.get(
	'/list/:groupId',
	// [requireAdmin, requireUser, validateResource(getMeetupsByGroupIdSchema)],
	[validateResource(getMeetupsByGroupIdSchema)],
	MeetupController.getMeetupsListHandler
);

/** Create a new meetup */
router.post(
	'/',
	[requireUser, validateResource(createMeetupSchema)],
	MeetupController.createMeetupHandler
);
/** Get meetup by ID: requires user to be logged in */
router.get(
	'/:meetupId',
	[requireUser, validateResource(getMeetupByIdSchema)],
	MeetupController.getMeetupHandler
);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get(
	'/:meetupId/public',
	[validateResource(getMeetupByIdSchema)],
	MeetupController.getNotLoggedInMeetupHandler
);
/** Get public info about the meetup (user doesn't need to be logged in or have an account) */
router.get(
	'/:meetupShortId/short',
	[validateResource(getMeetupByShortIdSchema)],
	MeetupController.getMeetupByShortIdHandler
);
/** Update meetup by ID */
router.patch(
	'/:meetupId',
	[requireUser, validateResource(updateMeetupSchema)],
	MeetupController.updateMeetupHandler
);
/** Delete meetup by ID */
router.delete('/:meetupId', [requireUser], MeetupController.deleteMeetupHandler);

// ########### RSVPS ###########
/** Create a new rsvp response to a meetup */
router.post(
	'/:meetupId/rsvp',
	[validateResource(createRsvpSchema), requireMeetup, requireCanRsvp],
	RsvpController.createRsvpHandler
);
/** Update an rsvp by ID */
router.patch(
	'/:meetupId/rsvp/:rsvpId',
	[validateResource(updateRsvpSchema), requireMeetup],
	RsvpController.updateRsvpHandler
);
/** Check if user has responded to this meetup yet */
router.post('/:meetupId/has-rsvpd', [requireMeetup], RsvpController.hasRsvpdToMeetupAlreadyHandler);

// FUTURE:
// Follow meetup
// Review meetup
// Comment/chat on meetup

export default router;
