// https://csv.js.org/parse/api/sync/
// RUN this from the project root
// node --loader ts-node/esm ./src/collections/events/eventsParser.ts
// IF DOES NOT WORK:
// node --experimental-specifier-resolution=node --loader ts-node/esm ./src/collections/events/eventsParser.ts

import * as fs from "node:fs";
import * as path from "node:path";
import type { EventsCsv } from "./eventsCsv.type";
import { fileURLToPath } from 'node:url';
import { type EventInput, TABLE_NAME_EVENTS } from "../../models/event.model";
import { parse } from "csv-parse/sync";
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";
import type { AWSError } from 'dynamoose/dist/aws/sdk';

// set AWS config for client
AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
const docClient = new AWS.DynamoDB.DocumentClient();
class CustomDynamoService {

  public putRecord<TRecord extends AWS.DynamoDB.DocumentClient.PutItemInput = any>(params: {
    TableName: string;
    Item: TRecord;
  }, theRecord: TRecord, callback?: (err: AWSError, data: EventInput) => any) {
    
    docClient.put(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item to the DB",
          ". Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log(`PutItem succeeded. ID: ${JSON.stringify(Object.entries(theRecord))}`);
      }
    });
  }
}

// get path, since __dirname is not available!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// csv file to import
const csvFilename = 'data.csv';
// get csv file ref
const csvFile = path.join(__dirname, csvFilename);
// resolve path
const csvFilePath = path.resolve(csvFile);
// read file
const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


const parserService = <T>(fileContent: string, csvHeaders: string[]) => {
  // init output
  let records: T[] = [];

  // parse
  try {
    records = parse(fileContent, {
      delimiter: ',',
      columns: csvHeaders,
      skip_empty_lines: true,
    });
  } catch (error) {
    console.error(error);
  }
  return records;
}


// CSV-SPECIFIC DATA...

// csv headers
const csvHeaders: Array<keyof EventsCsv> = ['data_start', 'date_end', 'event_name', 'location', 'recurs_each_year', 'url', 'notes'];
// parse csv file
const records = parserService<EventsCsv>(fileContent, csvHeaders);

/** Expects a string like: '14/01/2022' */
const excelDateToJsDate = (dateStr: string): Date => {
  return new Date(Date.parse(dateStr.split('/').reverse().join('-')));
};

if (records && records.length > 0) {
  
  // put the new records in the database...

  // build new mapped objects
  const mappedRecords = records.map<EventInput>((i, fakeId) => {
    return {
      eventId: Number(fakeId + 1), // start from 1 not zero
      dateStart: excelDateToJsDate(i.data_start).getTime(),
      dateEnd: excelDateToJsDate(i.date_end).getTime(),
      eventName: i.event_name,
      location: i.location,
      recurs: i.recurs_each_year.toString().toLowerCase() === 'yes',
      url: i.url,
      notes: i.notes,
    };
  });
  
  
  console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_EVENTS}. Please wait...`);
  
  // perform PUT operation for each document
  // Warning: running this multiple times will overwrite existing items by ID!
  // biome-ignore lint/complexity/noForEach: <explanation>
  mappedRecords
  .slice(1) // skip the header row!
  .forEach((theRecord) => {
    
    const params = {
      TableName: TABLE_NAME_EVENTS,
      Item: {
        ...theRecord
      } as any,
    };
    console.log('The record: ', theRecord.eventName);

    const dynamoService = new CustomDynamoService();
    dynamoService.putRecord(params, theRecord);

  });
}

