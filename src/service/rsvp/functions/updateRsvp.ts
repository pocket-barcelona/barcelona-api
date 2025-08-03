import {
	type MeetupDocument,
	TicketTypeEnum,
} from "../../../models/meetup.model";
import type { MeetupRsvpModel } from "../../../models/rsvp.model";
import type { UpdateRsvpInput } from "../../../schema/meetup/rsvp.schema";
// import logger from "../../../utils/logger";

export default async function updateResponse(
	theEvent: MeetupDocument,
	input: UpdateRsvpInput,
	userId: string,
): Promise<MeetupRsvpModel | null> {
	const { rsvpId, meetupId } = input.params;

	if (!rsvpId || !meetupId) {
		return null;
	}

	// make sure specific rsvp ID exists
	const existingGuest = theEvent.rsvps.find((r) => r.rsvpId === rsvpId);
	const existingGuestIndex = theEvent.rsvps.findIndex(
		(r) => r.rsvpId === rsvpId,
	);

	if (!existingGuest) {
		return null;
	}

	const newResponse: MeetupRsvpModel = {
		...existingGuest,
		userId: userId,
		rsvpId: rsvpId,
		// can only change the response and nothing else...
		response: input.body.response,
		changedTimes: existingGuest.changedTimes + 1,
		rsvpTimestampUpdated: Date.now(),
	};

	// update the response
	theEvent.rsvps[existingGuestIndex] = newResponse;
	// upsertedResponse = await EventService.updateEventResponse(theEvent)
	let updated = null;

	try {
		updated = await theEvent.save().catch((err) => {
			// logger.warn(err);
			return null;
		});
	} catch (error) {
		return null;
	}
	return newResponse;
}
