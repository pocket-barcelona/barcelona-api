// https://developers.google.com/calendar/api/quickstart/nodejs
// https://github.com/googleworkspace/node-samples/blob/main/calendar/quickstart/index.js
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import type { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { authenticate } from "@google-cloud/local-auth";
import { google, type calendar_v3 } from "googleapis";
import "dotenv/config"; // support for dotenv injecting into the process env
import type { OAuth2Client } from "google-auth-library";
import { config } from "../../config";
import logger from "../../utils/logger";
import type { CalendarEventDirectus } from "../../models/calendar.type";

export const OLDEST_PB_EVENT = new Date("2020-01-01T01:00:00").toISOString(); // need to tell GC from when we want events in a list. PB=Pocket Barcelona
export const HIDDEN_EVENT_DATE = "2020-01-02";
export const EVENT_TIMEZONE = "Europe/Madrid";

// If modifying these scopes, delete token.json.
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

class GoogleCalendarService {
  private authClient: JSONClient | OAuth2Client | null = null;

  /**
   * Load or request or authorization to call APIs
   */
  private async authorize(): Promise<JSONClient | OAuth2Client> {
    if (this.authClient) return this.authClient;

    // console.debug("Authorizing...");
    logger.info({
      message: "Authorizing with Google Calendar API...",
    });
    const client = await this.loadSavedCredentialsIfExist();
    if (client) {
      this.authClient = client;
      return client;
    }
    const oAuthClient = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (oAuthClient.credentials) {
      // console.debug("Saving credentials");
      logger.info({
        message: "Saving Google Calendar auth credentials...",
      });
      await this.saveCredentials(oAuthClient);
    }
    this.authClient = client;
    return oAuthClient;
  }

  /**
   * Reads previously authorized credentials from the save file.
   */
  private async loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content.toString("utf-8"));
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  /**
   * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
   */
  private async saveCredentials(client: OAuth2Client): Promise<void> {
    if (!client) {
      throw new Error("No client!");
    }
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content.toString("utf-8"));
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: "authorized_user",
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }

  /** List all Google calendars and IDs for this account */
  public async listCalendars(): Promise<
    calendar_v3.Schema$CalendarListEntry[]
  > {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return []; // @todo - throw error?;
    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.calendarList.list();

    const calendars = res.data.items;
    if (!calendars || calendars.length === 0) {
      console.log("No calendars found.");
      return [];
    }
    // calendars.map((calendar, i) => {
    //   console.log(`${calendar.summary ?? "NO summary found"} - ${calendar.id}`);
    // });
    return calendars;
  }

  /**
   * @param maxResults Lists the next X events on a specific calendar
   */
  public async listEvents(
    timeMin: string,
    maxResults = 1000,
    showDeleted = false
  ): Promise<calendar_v3.Schema$Event[] | undefined> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return []; // @todo - throw error?;

    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      // calendarId: "primary", // this is the default calendar
      calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
      timeMin,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
      showDeleted,
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      return [];
    }
    return events;
  }

  /** Get an event from a Google calendar using it's GC event ID (not iCalUID) */
  public async getEventById(
    eventId: string
  ): Promise<calendar_v3.Schema$Event | null> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return null;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.get({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
      });
      return res.data;
    } catch (error) {
      return null;
    }
  }

  /** Get an event from a Google calendar using its iCalUID */
  public async getEventByUID(
    uuid: string
  ): Promise<calendar_v3.Schema$Event | null> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return null;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.list({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        iCalUID: uuid,
        showDeleted: true, // show deleted events, which will be cancelled
      });
      if (res?.data.items && res.data.items.length > 0) {
        return res.data.items[0];
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /** Insert an event into Google calendar */
  public async insertEvent(
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | false> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    const insertFunc = (
      eventPayload: calendar_v3.Schema$Event
    ): Promise<calendar_v3.Schema$Event> => {
      return new Promise((resolve, reject) => {
        calendar.events.insert(
          {
            calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
            requestBody: eventPayload,
          },
          (err, res) => {
            if (err) {
              console.log(
                `Insert event - the API returned an error: ${err}. Event: ${eventPayload.summary}. Start: ${eventPayload.start?.date}`,
                eventPayload
              );
              return reject(err);
            }
            if (!res) {
              return reject("No response from Google Calendar API");
            }

            return resolve(res.data);
          }
        );
      });
    };

    try {
      const createdEvent = await insertFunc(event);
      if (createdEvent) {
        console.log(
          `Event created: ${createdEvent.id}, ${
            createdEvent.summary ?? "No summary!"
          }, ${createdEvent.start?.date}`
        );
      }
      return createdEvent;
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      // If the google event already exists, update the event instead...
      // Google events seem to be never deleted, instead they are status=cancelled
      // So we have to reuse the event by ID, or create a new iCalUID our side!
      if (error?.response?.status === 409) {
        console.log(
          "This event was previously cancelled. Attempting to update the event instead..."
        );
        if (!event.iCalUID) {
          throw new Error("No iCalUID found for event!");
        }
        const cancelledEvent = await this.getEventByUID(event.iCalUID);
        if (cancelledEvent?.id) {
          console.log(`Creating Google ID: ${cancelledEvent.id}`);
          // return await this.updateEvent(cancelledEvent.id, event);
          return await this.patchEvent(cancelledEvent, event);
        }
        // await this.updateEvent(event.id, eventPayload)
      }

      console.log(
        "------------------ Could not create event ------------------"
      );
      console.warn(error);
      // console.log({
      //   payload: event
      // });
      return false;
    }
  }

  /**
   * Update a single or recurring event in Google Calendar.
   * Event ID is the GC eventID (not iCalUID)
   */
  public async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | false> {
    // // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // const auth = (await this.authorize()) as any;
    // if (!auth) return false;
    // const calendar = google.calendar({ version: "v3", auth });
    
    if (event.recurrence) {
      console.warn('Recurring event, needs updating manually');
      return event;
      // const updatedSuccess: boolean[] = [];
      // const instances = await this.getEventInstances(eventId);
      // if (instances) {
        
      //   // @todo - do we need to update the main event too?
        
      //   // update each event - we only want to update the event's description for recurring instances
      //   for (const eventInstance of instances) {
      //     const done = await this._updateEventById(eventId, {
      //       ...eventInstance,
      //       description: event.description
      //     });
      //     updatedSuccess.push(!!done);
      //   }
      //   const allDone = updatedSuccess.every(i => i);
      //   return allDone ? event : false;
        
      // }

      // console.warn(`No event instances found for ${event.id}: ${event.summary ?? 'No summary'}`);
      // return false; // no instances!?
    }

    const success = await this._updateEventById(eventId, event);
    return success;
  }

  private async _updateEventById(
    eventId: string,
    payload: calendar_v3.Schema$Event
  ): Promise<false | calendar_v3.Schema$Event> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.update({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
        requestBody: {
          ...payload,
          // status: 'confirmed'
        },
      });
      return res.data;
    } catch (error) {
      console.warn(error);
      console.log({
        payload,
        id: eventId,
      });
      return false;
    }
  }

  /**
   * Get all instances of a recurring event
   * @param eventId Google calendar ID
   */
  public async getEventInstances(eventId: string): Promise<calendar_v3.Schema$Event[] | false> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });
    try {
      const res = await calendar.events.instances({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
      });
      return res.data.items ?? [];
    } catch (error) {
      console.warn(error);
      console.log({
        id: eventId,
      });
      return false;
    }
  }

  /**
   * @untested Patch an event in Google calendar by eventID (Not iCalUID)
   */
  public async patchEvent(
    originalEvent: calendar_v3.Schema$Event,
    newEvent: Partial<calendar_v3.Schema$Event>
  ): Promise<calendar_v3.Schema$Event | false> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    if (!originalEvent.id) return false;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.patch({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId: originalEvent.id,
        requestBody: {
          ...originalEvent,
          ...newEvent,
          start: {
            ...originalEvent.start,
            ...newEvent.start,
          },
          end: {
            ...originalEvent.end,
            ...newEvent.end,
          },
          status: "confirmed",
        },
      });
      return res.data;
    } catch (error) {
      console.warn(error);
      console.log({
        payload: newEvent,
        id: originalEvent.id,
      });
      return false;
    }
  }

  /**
   * Delete an event in Google calendar by eventID (Not iCalUID)
   * Note: Deleted events don't actually get deleted and the ID will
   * still exist, so it's not possible to create another event in
   * the future with the same ID!
   */
  public async deleteEvent(eventId: string): Promise<boolean> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      await calendar.events.delete({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
      });
      return true;
    } catch (error) {
      console.warn(error);
      console.log({
        id: eventId,
      });
      return false;
    }
  }

  public async deleteEventByHiding(
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | false> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    const { id: eventId } = event;
    if (!eventId) return false;

    try {
      const res = await calendar.events.update({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
        requestBody: {
          ...event,
          start: {
            ...event.start,
            timeZone: EVENT_TIMEZONE,
            date: HIDDEN_EVENT_DATE,
          },
          end: {
            ...event.end,
            timeZone: EVENT_TIMEZONE,
            date: HIDDEN_EVENT_DATE,
          },
        },
      });
      return res.data;
    } catch (error) {
      console.warn(error);
      console.log({
        payload: event,
        id: eventId,
      });
      return false;
    }
  }

  /** @untested - Delete an event in Google calendar by iCalUID */
  public async deleteEventByUID(uuid: string): Promise<boolean> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.list({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        iCalUID: uuid,
      });
      if (res?.data.items && res.data.items.length > 0) {
        await calendar.events.delete({
          calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
          eventId: res.data.items[0].id ?? "",
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  public async deleteAllGoogleCalendarEvents(): Promise<
    Record<string, boolean>
  > {
    const events = await this.listEvents(OLDEST_PB_EVENT, 1000);

    const eventDeleteInfo: Record<string, boolean> = {};
    if (!events) {
      logger.warn("No events to delete!");
      return eventDeleteInfo;
    }
    for (const gEvent of events) {
      if (!gEvent.id) continue; // ID should be defined
      const success = await this.deleteEvent(gEvent.id);
      console.log(`Delete ${gEvent.id} - ${success ? "success" : "failed"}`);
      eventDeleteInfo[gEvent.id] = success;
    }
    return eventDeleteInfo;
  }

  public buildCalendarEventPayload(
    event: CalendarEventDirectus
  ): calendar_v3.Schema$Event {
    // https://stackoverflow.com/questions/59867825/google-calendar-api-bug-end-date-is-1
    const { formatted: realEndDate } = getEventRealEndDate(event.date_end);

    const payload: calendar_v3.Schema$Event = {
      summary: event.event_name,
      // location: buildCalendarLocationString(event),
      location: event.location,
      description: buildCalendarDescription(event),
      start: {
        date: event.date_start, // "2024-08-15T09:00:00+02:00" or "2024-08-15"
        timeZone: EVENT_TIMEZONE,
      },
      end: {
        // @todo - this needs to be inclusive - currently not adding the last event day on Google!
        date: realEndDate, // "2024-08-21T21:00:00+02:00" or "2024-08-21"
        timeZone: EVENT_TIMEZONE,
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
      iCalUID: event.uuid,
      recurrence: event.recurrence_rule
        ? event.recurrence_rule.split(",")
        : undefined,
    };

    return payload;
  }
}

/** Convert our event structure into a Google Calendar event */
// export function mapToGoogleCalendarEvent(
//   item: CalendarEvent
// ): calendar_v3.Schema$Event {
//   if (!item.uuid) {
//     throw new Error("Missing internal UUID for Google Calendar event");
//   }

//   // for data logic, start times, all day events etc, see this URL:
//   // https://developers.google.com/calendar/api/concepts/events-calendars#recurrence_rule
//   const event: calendar_v3.Schema$Event = {
//     summary: item.eventName,
//     location: item.location, // @todo - does Google need this to be an actual location? Use LAT/LNG here
//     description: buildCalendarDescription(item),
//     start: {
//       dateTime: item.dateStart, // "2024-08-15T09:00:00+02:00"
//       timeZone: "Europe/Madrid",
//     },
//     end: {
//       dateTime: item.dateEnd, // "2024-08-21T21:00:00+02:00"
//       timeZone: "Europe/Madrid",
//     },
//     guestsCanInviteOthers: false,
//     guestsCanModify: false,
//     guestsCanSeeOtherGuests: false,
//     creator: {
//       displayName: 'Pocket Barcelona',
//       email: 'info@pocketbarcelona.com',
//     },
//     iCalUID: item.uuid, // Tell Google to use our ID, so that we don't get an automatic one! Will be used to update against later
//   };
//   return event;
// }

function getEventRealEndDate(dateEndStr: string): {
  /** Date like: yyyy-mm-dd */
  formatted: string;
  realEndDate: Date;
} {
  const realEndDate = new Date(dateEndStr);
  realEndDate.setUTCDate(realEndDate.getUTCDate() + 1);

  const year = realEndDate.getFullYear();
  const month = String(realEndDate.getMonth() + 1).padStart(2, "0");
  const day = String(realEndDate.getDate()).padStart(2, "0");
  const formatted = `${year}-${month}-${day}`;

  return {
    formatted,
    realEndDate,
  };
}

/**
 * Build the map link based on location accuracy
 * If lat/lng accurate, do this: https://maps.google.com/?q=42.346646,1.9572331
 * If not, do this: https://maps.google.com/?q=Ciutadella%20Park
 *
 * @url See also: https://stackoverflow.com/questions/1801732/how-do-i-link-to-google-maps-with-a-particular-longitude-and-latitude/52943975#52943975
 */
function buildMapLocationString(event: CalendarEventDirectus) {
  if (!event.lat || !event.lng) {
    return "";
  }
  // https://www.google.com/maps/search/?api=1&query=<lat>,<lng>
  // Ex: https://www.google.com/maps/search/?api=1&query=41.37903407143937,2.1742959490764666
  // Ex: https://www.google.com/maps/search/?api=1&query=Poblenou%20Neighbourhood
  let mapStr = "https://www.google.com/maps/search/?query=";

  // https://www.google.com/maps/search/?api=1&query=28.6139,77.2090
  // https://www.google.com/maps/search/?api=1&query=41.4134488,2.0182425&query_place_id=Molins%20de%20Rei

  // check accuracy
  // if (event.location_accuracy === 1) {
  //   mapStr += `${event.lat},${event.lng}`;
  // } else {
  //   mapStr += encodeURIComponent(event.location);
  // }

  // currently, lat/lng is handled in Google Sheets
  mapStr += `${event.lat},${event.lng}`;
  mapStr += '&api=1';
  // mapStr += ",16z"; // this doesn't work
  return mapStr;
}

function buildCalendarDescription(event: CalendarEventDirectus) {
  // Build this:
  // ----------------
  // Event type
  // URL (if exists)
  // Location map link
  // Is in Barcelona?: Yes/No

  // Notes from sheet
  // ----------------
  let description = "";

  description += `${getEventTypeEmoji(event)} Type: ${event.event_type}\n`;
  if (event.url) {
    description += `\n🔗 URL: ${event.url}\n`;
  }

  const startStr = new Date(event.date_start).toDateString();
  const endStr = new Date(event.date_end).toDateString();
  description += `\n📆 Start: ${startStr}.\nEnd: ${endStr}\n`;

  const isMultiDays = isMultiDayEvent(event.date_start, event.date_end);
  if (isMultiDays) {
    description += '\nℹ️ (note: This event spans multiple days)\n';
  }
  


  // location on map link
  description += `\n📍 Location: ${buildMapLocationString(event)}\n`;

  if (event.event_notes) {
    description += `\n📝 Notes: ${event.event_notes}\n`;
  }

  if (event.is_in_barcelona) {
    // description += '\n\nNote: This event is in Barcelona';
  } else {
    description += "\nNote: This event is NOT in Barcelona\n";
  }

  return description;
}

function getEventTypeEmoji({ event_type }: CalendarEventDirectus): string {
  switch (event_type.toLowerCase()) {
    case "culture / arts festival":
      return "🎭";
    case "festa major":
      return "🥁";
    case "food / drink festival":
      return "🍸";
    case "lgbt festival":
      return "🏳️‍🌈";
    case "local / neighbourhood festival":
      return "🍻";
    case "music / film festival":
      return "🎤";
    case "open day / weekend":
      return "🎟";
    case "sporting event / festival":
      return "🥇";
    case "barcelona public holiday":
      return "🛌";
    case "tech festival":
      return "👾";
    default:
      return "🎫";
  }
}

/** Start and end dates are always a day apart so check if event is more than 48 hours apart! Ignores leap time! */
function isMultiDayEvent(startStr: string, endStr: string) {
  const start = new Date(startStr);
  const end = new Date(endStr);
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  return Math.abs(start.getTime() - end.getTime()) >= twoDaysMs;
}

export default new GoogleCalendarService();
