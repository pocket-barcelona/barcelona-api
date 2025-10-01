/** biome-ignore-all lint/correctness/noUnusedImports: WIP */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'csv-parse/sync';
import { type EventInput, TABLE_NAME_EVENTS } from '../../models/event.model.js';
import type { EventsCsv } from './eventsCsv.type.js';
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS, { DynamoDB, DynamoDBClient, type PutItemInput } from '@aws-sdk/client-dynamodb';

// #################################################
// Do not use this script - SEE: syncEventsDynamo.ts
// #################################################

// biome-ignore lint/correctness/noUnusedVariables: WIP
const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});
// import type { AWSError } from 'dynamoose/dist/aws/sdk';

// set AWS config for client
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
// AWS.config.update({
// 	region: process.env.AWS_REGION,
// 	credentials: {
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
// 	},
// });

// const docClient = DynamoDBDocument.from(new DynamoDB());
// class CustomDynamoService {
// 	public putRecord<TRecord extends PutCommandInput = any>(
// 		params: {
// 			TableName: string;
// 			Item: TRecord;
// 		},
// 		theRecord: TRecord,
// 		callback?: (err: ServiceException, data: EventInput) => any
// 	) {
// 		docClient.put(params, (err, data) => {
// 			if (err) {
// 				console.error(
// 					'Unable to add item to the DB',
// 					'. Error JSON:',
// 					JSON.stringify(err, null, 2)
// 				);
// 			} else {
// 				console.log(`PutItem succeeded. ID: ${JSON.stringify(Object.entries(theRecord))}`);
// 			}
// 		});
// 	}
// }

// get path, since __dirname is not available!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// csv file to import
const csvFilename = 'events.csv';
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
};

// CSV-SPECIFIC DATA...

// csv headers
const csvHeaders: Array<keyof EventsCsv> = [
	'id',
	'uuid',
	'data_start',
	'date_end',
	'event_type',
	'event_active',
	'event_recurs',
	'recurrence_rule',
	'event_name',
	'slug',
	'location',
	'lat',
	'lng',
	'location_accuracy',
	'is_in_barcelona',
	'url',
	'event_notes',
];

// parse csv file
let records: EventsCsv[];
try {
	records = parserService<EventsCsv>(fileContent, csvHeaders);
	// biome-ignore lint/suspicious/noExplicitAny: Don't care about error
} catch (error: any) {
	throw new Error(`Error parsing CSV file. Message: ${error.message}`);
}

/** Expects a string like: 14-01-2022 or 14/01/2022 */
// const excelDateToJsDate = (dateStr: string, separator: '/' | '-' = '-'): Date => {
// 	return new Date(Date.parse(dateStr.split(separator).reverse().join('-')));
// };

/** Expects a string like: 2022-05-15 */
const excelDateToJsDate = (dateStr: string): Date => {
	return new Date(Date.parse(dateStr));
};

if (records.length === 0) {
	throw new Error('No records to sync. Exiting...');
}

// build new mapped objects
const mappedRecords: EventInput[] = records.map((row, _index) => {
	return {
		// eventId: Number(fakeId + 1), // start from 1 not zero
		eventId: row.id,
		uuid: row.uuid,
		dateStart: excelDateToJsDate(row.data_start),
		dateEnd: excelDateToJsDate(row.date_end),
		eventType: row.event_type,
		eventActive: true,
		eventRecurs: !!row.event_recurs,
		recurrenceRule: row.recurrence_rule,
		eventName: row.event_name,
		slug: row.slug,
		location: row.location,
		lat: Number(row.lat),
		lng: Number(row.lng),
		locationAccuracy: Number(row.location_accuracy) as EventInput['locationAccuracy'],
		isInBarcelona: !!row.is_in_barcelona,
		url: row.url,
		eventNotes: row.event_notes,
	};
});

// 	console.log(
// 		`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_EVENTS}. Please wait...`
// 	);

// perform PUT operation for each document
// Warning: running this multiple times will overwrite existing items by ID!
mappedRecords
	.slice(1) // skip the header row!
	.forEach((theRecord) => {
		// const params: PutItemInput = {
		// 	TableName: TABLE_NAME_EVENTS,
		// 	Item: {
		// 		...theRecord,
		// 	},
		// };
		console.log('The record: ', theRecord.eventName);

		// const dynamoService = new CustomDynamoService();
		// dynamoService.putRecord(params, theRecord);
	});
