import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { CalendarEventDirectus } from "../../../models/calendar.type";
import { CalendarService } from "../../../service/calendar/calendar.service";
import GoogleCalendarService from "../../../service/calendar/googleCalendar.service";
import DirectusService from "../../../service/shared/directus.service";
import type { calendar_v3 } from "googleapis";

const OLDEST_PB_EVENT = new Date("2020-01-01T01:00:00").toISOString(); // need to tell GC from when we want events in a list
const DRY_RUN = false;

/**
 * Sync all calendar events from Directus to Google Calendar
 * @param req
 * @param res
 * @returns
 */
export default async function syncEvents(req: Request, res: Response) {
  // Directus - pagination
  // https://docs.directus.io/blog/implementing-pagination-and-infinite-scrolling-in-next-js.html

  // const calendarService = new CalendarService();

  // 1. Get all events from Directus
  // 2. Get all events from Google Calendar
  // 3. Check for event IDs in GC events which don't exist in Directus list and delete these from GC
  // 4. For each event in Directus, check if it exists in Google Calendar
  // 5. If event exists, update it
  // 6. If event does not exist, create it

  const eventsToBeDeleted: calendar_v3.Schema$Event[] = [];
  const eventsDeleted: calendar_v3.Schema$Event[] = [];
  const eventsNotDeleted: calendar_v3.Schema$Event[] = [];
  const eventsToBeCreated: calendar_v3.Schema$Event[] = [];
  const eventsCreated: calendar_v3.Schema$Event[] = [];
  const eventsNotCreated: calendar_v3.Schema$Event[] = [];
  const eventsToBeUpdated: calendar_v3.Schema$Event[] = [];
  const eventsUpdated: calendar_v3.Schema$Event[] = [];
  const eventsNotUpdated: calendar_v3.Schema$Event[] = [];

  const directusEvents = (
    await DirectusService.getAllDirectusItems<"events", CalendarEventDirectus>(
      "events"
    )
  ).slice(0, 70);
  if (directusEvents.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Headless CMS contains no items to sync", res.statusCode));
  }

  // make sure Directus event start/end times are correct
  for (const event of directusEvents) {
    const startTime = new Date(event.date_start);
    const endTime = new Date(event.date_end);
    if (startTime.getTime() > endTime.getTime()) {
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(
        error(
          `Warning: An event has an invalid start time: ID: ${event.id} - ${event.event_name}`,
          res.statusCode
        )
      );
    }
  }

  const googleEvents = await GoogleCalendarService.listEvents(
    OLDEST_PB_EVENT,
    1000
  );
  if (undefined === googleEvents) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(
        error(
          "Warning: Error fetching Google Calendar events during sync!",
          res.statusCode
        )
      );
  }

  const invalidIds = googleEvents.some((i) => i.id === undefined);
  if (invalidIds) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(
        error(
          "Invalid Google calendar IDs found - at least 1 is undefined!",
          res.statusCode
        )
      );
  }

  // Logic check - see if there are more Directus events than Google events
  if (googleEvents.length > directusEvents.length) {
    console.debug(
      "Warning: Less Directus events than Google Calendar events. Is this right?!"
    );
  }

  const directusUUIDs = directusEvents.map((e) => e.uuid ?? "");

  // find events to be deleted from GC, which are not in Directus
  for (const gEvent of googleEvents) {
    if (!gEvent.id) continue; // ID should be defined
    if (gEvent.iCalUID && !directusUUIDs.includes(gEvent.iCalUID)) {
      eventsToBeDeleted.push(gEvent);
    }
  }

  // find events to be updated
  for (const directusEvent of directusEvents) {
    const gcEvent = googleEvents.find((e) => e.iCalUID === directusEvent.uuid);
    const mappedEvent =
      GoogleCalendarService.buildCalendarEventPayload(directusEvent);
    // compare events
    if (gcEvent) {
      // non-greedy update - only update if data is actually different
      const isSame = compareEvents(gcEvent, mappedEvent);
      if (!isSame) {
        // mark event for update
        eventsToBeUpdated.push(mappedEvent);
      }
    } else {
      // mark event for creation
      eventsToBeCreated.push(mappedEvent);
    }
  }

  console.log("To be deleted: ", eventsToBeDeleted.length);
  console.log("To be created: ", eventsToBeCreated.length);
  console.log("To be updated: ", eventsToBeUpdated.length);

  if (DRY_RUN) {
    for (const i of eventsToBeCreated) {
      console.log(`Would create: ${i.iCalUID} - ${i.summary}`);
    }
    return res.send(
      success(true, {
        message: "Dry run completed.",
      })
    );
  }

  console.log(
    `---------- Deleting ${eventsToBeDeleted.length} event/s... ----------`
  );
  for (const gEvent of eventsToBeDeleted) {
    if (!gEvent.id) continue;
    // delete this event from GC
    console.log(`Deleting ${gEvent.summary}. id: ${gEvent.id}`);
    const success = await GoogleCalendarService.deleteEvent(gEvent.id);
    if (success) {
      eventsDeleted.push(gEvent);
    } else {
      eventsNotDeleted.push(gEvent);
    }

    if (eventsDeleted.length >= 2) {
      return res.send(
        error(
          "Event deletion failed 2 times, stopping!",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  console.log(
    `---------- Updating ${eventsToBeUpdated.length} event/s... ----------`
  );
  for (const gEvent of eventsToBeUpdated) {
    const success = gEvent.id
      ? await GoogleCalendarService.updateEvent(gEvent.id, gEvent)
      : false;
    if (success) {
      eventsUpdated.push(gEvent);
    } else {
      eventsNotUpdated.push(gEvent);
    }

    return res.send(
      error(
        "Event updating failed 2 times, stopping!",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }

  console.log(
    `---------- Creating ${eventsToBeCreated.length} event/s... ----------`
  );
  for (const gEvent of eventsToBeCreated) {
    const success = await GoogleCalendarService.insertEvent(gEvent);
    if (success) {
      eventsCreated.push(gEvent);
    } else {
      eventsNotCreated.push(gEvent);
    }

    if (eventsNotCreated.length >= 2) {
      return res.send(
        error(
          "Event creation failed 2 times, stopping!",
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  const deleteErrors =
    eventsToBeDeleted.length > 0 && eventsNotDeleted.length > 0;
  const createErrors =
    eventsToBeCreated.length > 0 && eventsNotCreated.length > 0;
  const updateErrors =
    eventsToBeUpdated.length > 0 && eventsNotUpdated.length > 0;

  if (deleteErrors || createErrors || updateErrors) {
    console.log(`Delete errors: ${deleteErrors}`);
    console.log(`Create errors: ${createErrors}`);
    console.log(`Update errors: ${updateErrors}`);
    return res.send(success("Events synced, but with errors"));
  }

  if (eventsToBeDeleted.length === 0 && eventsToBeCreated.length === 0 && eventsToBeUpdated.length === 0) {
    return res.send(success("No events to sync. All done."));
  }

  return res.send(success("Events synced!"));
}

function compareEvents(
  gcEvent: calendar_v3.Schema$Event,
  directusMappedEvent: calendar_v3.Schema$Event
) {
  if (gcEvent?.summary !== directusMappedEvent.summary) {
    return false;
  }
  if (gcEvent?.location !== directusMappedEvent.location) {
    return false;
  }
  if (gcEvent?.description !== directusMappedEvent.description) {
    return false;
  }
  // compare dates
  if (gcEvent?.start?.dateTime !== directusMappedEvent.start?.dateTime) {
    return false;
  }
  if (gcEvent?.start?.date !== directusMappedEvent.start?.date) {
    return false;
  }
  if (gcEvent?.end?.dateTime !== directusMappedEvent.end?.dateTime) {
    return false;
  }
  if (gcEvent?.end?.date !== directusMappedEvent.end?.date) {
    return false;
  }
  return true;
}
