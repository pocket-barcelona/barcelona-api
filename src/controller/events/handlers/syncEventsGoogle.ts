import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import type { CalendarEventDirectus } from "../../../models/calendar.type";
import GoogleCalendarService, {
  OLDEST_PB_EVENT,
} from "../../../service/calendar/googleCalendar.service";
import DirectusService from "../../../service/shared/directus.service";
import type { calendar_v3 } from "googleapis";

const DRY_RUN = false;
const CALENDAR_API_ERROR_THRESHOLD_TIMES = 1; // stop syncing to google if this many errors are encountered
const THROTTLE_MAX_CREATE_OR_UPDATE = 100;

/**
 * Sync all calendar events from Directus to Google Calendar
 * @param req
 * @param res
 * @returns
 */
export default async function syncEventsGoogle(req: Request, res: Response) {
  // Directus - pagination
  // https://docs.directus.io/blog/implementing-pagination-and-infinite-scrolling-in-next-js.html

  // const calendarService = new CalendarService();

  // 1. Get all events from Directus
  // 2. Get all events from Google Calendar
  // 3. Check for event IDs in GC events which don't exist in Directus list and delete these from GC
  // 4. For each event in Directus, check if it exists in Google Calendar
  // 5. If event exists, update it
  // 6. If event does not exist, create it

  // Delete all events in google calendar!
  // GoogleCalendarService.deleteAllGoogleCalendarEvents();
  // return;

  // List all events in google calendar
  // const events = GoogleCalendarService.listEvents(OLDEST_PB_EVENT, 100, true);
  // return res.send(success(events));

  if (DRY_RUN) {
    console.log("PERFORMING DRY-RUN...");
  }

  const eventsToBeDeleted: calendar_v3.Schema$Event[] = [];
  /** List of events which actually were successfully deleted */
  const eventsDeleted: calendar_v3.Schema$Event[] = [];
  /** List of events which were not successfully deleted due to Google errors */
  const eventsNotDeleted: calendar_v3.Schema$Event[] = [];
  const eventsToBeCreated: calendar_v3.Schema$Event[] = [];
  /** List of events which actually were successfully created */
  const eventsCreated: calendar_v3.Schema$Event[] = [];
  /** List of events which were not successfully created due to Google errors */
  const eventsNotCreated: calendar_v3.Schema$Event[] = [];
  const eventsToBeUpdated: calendar_v3.Schema$Event[] = [];
  /** List of events which actually were successfully updated */
  const eventsUpdated: calendar_v3.Schema$Event[] = [];
  /** List of events which were not successfully updated due to Google errors */
  const eventsNotUpdated: calendar_v3.Schema$Event[] = [];

  const directusEvents = (
    await DirectusService.getAllDirectusItems<"events", CalendarEventDirectus>(
      "events"
    )
  )
    .filter((e) => e.event_active)
    .filter((e) => {
      // make sure to ignore events from previous year - will save on calendar create requests
      const start = new Date(e.date_start);
      const year = start.getFullYear();
      const thisYear = new Date().getFullYear();
      return year >= thisYear;
    });
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

  // Logic check warning - see if there are more Directus events than Google events
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
        eventsToBeUpdated.push({
          ...mappedEvent,
          id: gcEvent.id, // updating needs the GCID
        });
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
    for (const i of eventsToBeUpdated) {
      console.log(`Would update: ${i.iCalUID} - ${i.summary}`);
    }
    for (const i of eventsToBeDeleted) {
      console.log(`Would delete: ${i.iCalUID} - ${i.summary}`);
    }

    // spit out payload if there's only 1
    if (eventsToBeCreated.length === 1) {
      console.log("Single create event payload: ", eventsToBeCreated[0]);
    }
    if (eventsToBeUpdated.length === 1) {
      console.log("Single update event payload: ", eventsToBeUpdated[0]);
    }
    if (eventsToBeDeleted.length === 1) {
      console.log("Single delete event payload: ", eventsToBeDeleted[0]);
    }

    return res.send(
      success(
        {
          toDelete: eventsToBeDeleted,
          toCreate: eventsToBeCreated,
          toUpdate: eventsToBeUpdated,
        },
        {
          message: "Dry run completed.",
          meta: {
            toDelete: eventsToBeDeleted.length,
            toCreate: eventsToBeCreated.length,
            toUpdate: eventsToBeUpdated.length,
          },
        }
      )
    );
  }

  console.log(
    `---------- Deleting ${eventsToBeDeleted.length} event/s... ----------`
  );
  for (const eventPayload of eventsToBeDeleted) {
    if (!eventPayload.id) continue;
    // delete this event from GC
    console.log(`Deleting ${eventPayload.summary}. id: ${eventPayload.id}`);
    // const success = await GoogleCalendarService.deleteEvent(eventPayload.id);
    const success = await GoogleCalendarService.deleteEventByHiding(
      eventPayload
    );
    console.log(`Delete success: ${success ? success.id : success}`);
    if (success) {
      eventsDeleted.push(eventPayload);
    } else {
      eventsNotDeleted.push(eventPayload);
    }

    if (eventsNotDeleted.length >= CALENDAR_API_ERROR_THRESHOLD_TIMES) {
      return res.send(
        error(
          `Event deletion failed ${CALENDAR_API_ERROR_THRESHOLD_TIMES} time/s, stopping!`,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
  }

  let createdOrUpdatedCounter = 0;

  console.log(
    `---------- Updating ${eventsToBeUpdated.length} event/s... ----------`
  );
  for (const eventPayload of eventsToBeUpdated) {
    // break for throttling sync action
    if (createdOrUpdatedCounter >= THROTTLE_MAX_CREATE_OR_UPDATE) continue;
    
    if (eventPayload.recurrence !== undefined) {
      if (!eventPayload.id) continue;
      
      const instances = await GoogleCalendarService.getEventInstances(eventPayload.id);
      if (instances && instances.length !== 0) {
        const success = await GoogleCalendarService.patchEventInstance(instances, eventPayload)
        console.log(`Update success: ${success ? success.id : success}`);
        if (success) {
          eventsUpdated.push(eventPayload);
        } else {
          eventsNotUpdated.push(eventPayload);
        }
      } else {
        console.warn('No instances found for event!');
      }

    } else {

      console.log(`Updating ${eventPayload.summary}. id: ${eventPayload.id}`);
      const success = eventPayload.id
        ? await GoogleCalendarService.updateEvent(eventPayload.id, eventPayload)
        : false;
      console.log(`Update success: ${success ? success.id : success}`);
      if (success) {
        eventsUpdated.push(eventPayload);
      } else {
        eventsNotUpdated.push(eventPayload);
      }
  
      if (eventsNotUpdated.length >= CALENDAR_API_ERROR_THRESHOLD_TIMES) {
        return res.send(
          error(
            `Event updating failed ${CALENDAR_API_ERROR_THRESHOLD_TIMES} time/s, stopping!`,
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        );
      }

      await sleep(5);
      createdOrUpdatedCounter++;
    }
  }

  console.log(
    `---------- Creating ${eventsToBeCreated.length} event/s... ----------`
  );
  for (const eventPayload of eventsToBeCreated) {
    // break for throttling sync action
    if (createdOrUpdatedCounter >= THROTTLE_MAX_CREATE_OR_UPDATE) continue;

    console.log(
      `Creating ${eventPayload.summary}. iCalUID: ${eventPayload.iCalUID}`
    );
    const success = await GoogleCalendarService.insertEvent(eventPayload);
    console.log(
      `Create success: ${!!success}. Event: ${
        !success ? "No event data" : success.summary
      }`
    );
    if (success) {
      eventsCreated.push(eventPayload);
    } else {
      eventsNotCreated.push(eventPayload);
    }

    if (eventsNotCreated.length >= CALENDAR_API_ERROR_THRESHOLD_TIMES) {
      return res.send(
        error(
          `Event creation failed ${CALENDAR_API_ERROR_THRESHOLD_TIMES} time/s, stopping!`,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    createdOrUpdatedCounter++;
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

  if (
    eventsToBeDeleted.length === 0 &&
    eventsToBeCreated.length === 0 &&
    eventsToBeUpdated.length === 0
  ) {
    return res.send(success("No events to sync. All done."));
  }

  console.log("DONE!");

  return res.send(
    success("Events synced!", {
      meta: {
        deleted: eventsDeleted.length,
        notDeleted: eventsNotDeleted.length,
        created: eventsCreated.length,
        notCreated: eventsNotCreated.length,
        updated: eventsUpdated.length,
        notUpdated: eventsNotUpdated.length,
      },
    })
  );
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
  if (gcEvent?.start?.date !== directusMappedEvent.start?.date) {
    return false;
  }
  if (gcEvent?.end?.date !== directusMappedEvent.end?.date) {
    return false;
  }
  if (gcEvent?.recurrence && gcEvent?.recurrence !== directusMappedEvent.recurrence) {
    return false;
  }
  return true;
}

const sleep = (time: number) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.ceil(time * 1000))
  );
};