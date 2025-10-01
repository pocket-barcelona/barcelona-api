import fs from 'node:fs';
import { parse } from 'csv-parse';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import EventModel, { type EventInput } from '../../../models/event.model.js';
import { type EventCsvFile, mapCsvToEventInput } from '../../../models/event.type.js';

const __dirname = new URL('.', import.meta.url).pathname;

/**
 * Sync all calendar events from CSV to AWS Dynamo DB
 */
export default async function syncEventsDynamo(_req: Request, res: Response) {
	// 1. parse CSV file
	// 2. map to Dynamo schema
	// 3. put into Dynamo DB table

	// Read the content
	const processFile = async () => {
		const records: EventCsvFile[] = [];
		try {
			const parser = fs.createReadStream(`${__dirname}../../../collections/events/events.csv`).pipe(
				parse({
					// CSV options
					bom: true,
					delimiter: ',',
					encoding: 'utf-8',
					columns: true,
					from: 1,
				})
			);
			for await (const record of parser) {
				// Work with each record
				records.push(record);
			}
			return records;
		} catch (error) {
			console.error(error);
			// return error;
			return records;
		}
	};

	const records = await processFile();

	if (!records || records.length === 0) {
		return res.send(success('Nothing to do. Processed: 0 records'));
	}

	const mappedRecords = records.map(mapCsvToEventInput);

	// upload (PUT) to Dynamo

	try {
		const unprocessed: EventInput[] = [];
		// batch put only supports 20 at a time!

		const chunkSize = 10;
		for (let i = 0; i < mappedRecords.length; i += chunkSize) {
			const chunk = mappedRecords.slice(i, i + chunkSize);
			EventModel.batchPut(chunk, (err) => {
				if (err) {
					console.log(err);
					unprocessed.push(err);
				}
			});
		}

		if (unprocessed.length > 0) {
			return res.send(
				error(`Unprocessed: ${unprocessed.length} records`, StatusCodes.INTERNAL_SERVER_ERROR)
			);
		}

		return res.send(success(`DONE. Processed: ${mappedRecords.length} records`));
	} catch (err) {
		if (err instanceof Error) {
			return res.send(error(err.message, StatusCodes.INTERNAL_SERVER_ERROR));
		}
		return res.send(error('Server error!', StatusCodes.INTERNAL_SERVER_ERROR));
	}
}
