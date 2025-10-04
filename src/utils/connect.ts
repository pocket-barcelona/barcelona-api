import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
// import AWS from "aws-sdk";
import logger from './logger.js';
// import { config } from "../config.js";

// Support for .env files locally
// require('dotenv').config();
import 'dotenv/config';

// https://stackoverflow.com/questions/47009074/configuration-error-missing-region-in-config-aws
// JS SDK v3 does not support global configuration.
// Codemod has attempted to pass values to each service client in this file.
// You may need to update clients outside of this file, if they use global config.
// AWS.config.update({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   }
// });

async function connect() {
	// AWS Region
	const REGION = process.env.AWS_REGION ?? 'eu-west-3'; //e.g. "eu-west-3"
	// Create an Amazon DynamoDB service client object
	const client = new DynamoDBClient({
		region: REGION,
		credentials: {
			accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
		},
	});

	// https://github.com/serverless/examples/blob/master/aws-node-typescript-rest-api-with-dynamodb/todos/get.ts

	const command = new ListTablesCommand({});
	try {
		const results = await client.send(command);
		const tablesList = (results?.TableNames ?? []).join(', ');
		logger.info({
			tables: tablesList,
		});
		logger.info('DB connected');
	} catch (_error) {
		logger.error('Could not connect to db. Check AWS accessKeyId and secretAccessKey?');
	}
	return client;
}

export default connect;
