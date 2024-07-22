// node --experimental-specifier-resolution=node --loader ts-node/esm ./src/collections/calendar/calendar.ts
// node --loader ts-node/esm ./src/collections/calendar/calendar.ts
// https://developers.google.com/calendar/api/quickstart/nodejs
// https://github.com/googleworkspace/node-samples/blob/main/calendar/quickstart/index.js
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import type { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { authenticate } from "@google-cloud/local-auth";
import { google, type calendar_v3 } from "googleapis";
import "dotenv/config"; // support for dotenv injecting into the process env
import type { OAuth2Client } from 'google-auth-library';

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const POCKET_BARCELONA_CALENDAR_ID = "c_3c69c11b6d6975697418e1f928a6fef20f0bb4202b340bb3f9130425b241de1d@group.calendar.google.com";

/**
 * Reads previously authorized credentials from the save file.
 */
async function loadSavedCredentialsIfExist() {
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
async function saveCredentials(client: OAuth2Client) {
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

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  console.log('Authorizing...');
  const client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  const oAuthClient = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (oAuthClient.credentials) {
    console.log('Saving credentials');
    await saveCredentials(oAuthClient);
  }
  return oAuthClient;
}

/** List all calendars and IDs for this account */
async function listCalendars(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.calendarList.list();
  
  const calendars = res.data.items;
  if (!calendars || calendars.length === 0) {
    console.log("No calendars found.");
    return;
  }
  console.log("Calendars:");
  calendars.map((calendar, i) => {
    console.log(`${calendar.summary ?? 'NO summary found'} - ${calendar.id}`);
  });
}


/**
 * Lists the next 10 events on a specific calendar
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    // calendarId: "primary", // this is the default calendar
    calendarId: POCKET_BARCELONA_CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log("No upcoming events found.");
    return;
  }
  console.log("Upcoming 10 events:");
  events.map((event, i) => {
    const start = event.start?.dateTime || event.start?.date || 'No start date';
    console.log(`${start} - ${event.summary ?? 'NO summary found'}`);
  });
}

async function insertEvent(auth: any) {
  const calendar = google.calendar({ version: "v3", auth });
  const event: calendar_v3.Schema$Event = {
    summary: "Gràcia Festival 2024",
    location: "Gràcia, Barcelona",
    description: "The Gràcia neighbourhood festival",
    start: {
      dateTime: "2024-08-15T09:00:00+02:00",
      timeZone: "Europe/Madrid",
    },
    end: {
      dateTime: "2024-08-21T21:00:00+02:00",
      timeZone: "Europe/Madrid",
    }
  };

  calendar.events.insert(
    {
      calendarId: POCKET_BARCELONA_CALENDAR_ID,
      requestBody: event,
    },
    (err, res) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        return;
      }
      console.log("Event created: %s", res?.data.htmlLink);
    }
  );
}


// authorize().then(listCalendars).catch(console.error);
// authorize().then(listEvents).catch(console.error);
authorize().then(insertEvent).catch(console.error);
