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
    maxResults = 1000
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
    });
    const events = res.data.items;
    if (!events || events.length === 0) {
      return [];
    }
    return events;
  }

  /** Get an event from a Google calendar using it's GC event ID (not iCalUID) */
  public async getEvent(
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
  ): Promise<calendar_v3.Schema$Event | boolean> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return false;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      calendar.events.insert(
        {
          calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
          requestBody: event,
        },
        (err, res) => {
          if (err) {
            console.log(`The API returned an error: ${err}. Event: ${event.summary}. Start: ${event.start}`);
            return false;
          }
          console.log(`Event created: ${res?.data.id}, ${res?.data.summary ?? 'No summary!'}, ${res?.data.start?.date}`);
          return res?.data;
        }
      );
      return event;
    } catch (error) {
      return false;
    }
  }

  /** Update an event in Google calendar. Event ID is the GC eventID (not iCalUID) */
  public async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event
  ): Promise<calendar_v3.Schema$Event | null> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return null;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      const res = await calendar.events.update({
        calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
        eventId,
        requestBody: event,
      });
      return res.data;
    } catch (error) {
      return null;
    }
  }

  /** Delete an event in Google calendar by eventID (Not iCalUID) */
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

  public buildCalendarEventPayload(
    event: CalendarEventDirectus
  ): calendar_v3.Schema$Event {
    const payload: calendar_v3.Schema$Event = {
      summary: event.event_name,
      // location: buildCalendarLocationString(event),
      location: event.location,
      description: buildCalendarDescription(event),
      start: {
        date: event.date_start, // "2024-08-15T09:00:00+02:00"
        timeZone: "Europe/Madrid",
      },
      end: {
        // @todo - this needs to be inclusive - currently not adding the last event day on Google!
        date: event.date_end, // "2024-08-21T21:00:00+02:00"
        timeZone: "Europe/Madrid",
      },
      guestsCanInviteOthers: false,
      guestsCanModify: false,
      guestsCanSeeOtherGuests: false,
      iCalUID: event.uuid,
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


/**
 * Build the map link based on location accuracy
 * If lat/lng accurate, do this: https://maps.google.com/?q=42.346646,1.9572331
 * If not, do this: https://maps.google.com/?q=Ciutadella%20Park
 * 
 * @url See also: https://stackoverflow.com/questions/1801732/how-do-i-link-to-google-maps-with-a-particular-longitude-and-latitude
 */
function buildMapLocationString(event: CalendarEventDirectus) {
  let mapStr = "https://maps.google.com/?q=";
  // check accuracy
  if (event.location_accuracy === 1) {
    mapStr += `${event.lat},${event.lng}`;
  } else {
    mapStr += encodeURIComponent(event.location);
  }
  mapStr += ',16z';
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

  description += `Event type: ${event.event_type}`;
  if (event.url) {
    description += `\nURL: ${event.url}`;
  }
  
  // location on map link
  description += `\nLocation: ${buildMapLocationString(event)}`;

  if (event.event_notes) {
    description += `\n\nNotes: ${event.event_notes}`;
  }
  
  if (event.is_in_barcelona) {
    // description += '\n\nNote: This event is in Barcelona';
  } else {
    description += '\n\nNote: This event is NOT in Barcelona';
  }
  return description;
}

export default new GoogleCalendarService();
