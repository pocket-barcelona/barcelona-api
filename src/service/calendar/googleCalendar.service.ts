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
  /**
   * Load or request or authorization to call APIs
   */
  private async authorize() {
    // console.debug("Authorizing...");
    logger.info({
      message: "Authorizing with Google Calendar API...",
    });
    const client = await this.loadSavedCredentialsIfExist();
    if (client) {
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
    maxResults = 10
  ): Promise<calendar_v3.Schema$Event[] | undefined> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return []; // @todo - throw error?;

    const calendar = google.calendar({ version: "v3", auth });
    const res = await calendar.events.list({
      // calendarId: "primary", // this is the default calendar
      calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
      timeMin: new Date().toISOString(),
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
  ): Promise<calendar_v3.Schema$Event | null> {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const auth = (await this.authorize()) as any;
    if (!auth) return null;
    const calendar = google.calendar({ version: "v3", auth });

    try {
      calendar.events.insert(
        {
          calendarId: config.POCKET_BARCELONA_CALENDAR_ID,
          requestBody: event,
        },
        (err, res) => {
          if (err) {
            console.log(`The API returned an error: ${err}`);
            return;
          }
          console.log("Event created: %s", res?.data.id);
          return res?.data;
        }
      );
    } catch (error) {
      return null;
    }
    return null;
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

  /** Delete an event in Google calendar by eventID */
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
}

export default new GoogleCalendarService();
