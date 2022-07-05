// https://csv.js.org/parse/api/sync/
// RUN this from the project root
// node --loader ts-node/esm ./src/collections/barrios/barrioParser.ts

import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/sync';
import { BarrioCsv } from "./barrioCsv.type";
import { fileURLToPath } from 'url';
import { BarrioInput } from "../../models/barrio.model";
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";

// set AWS config for client
AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = new AWS.DynamoDB.DocumentClient();


// get path, since __dirname is not available!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);


// csv file to import
const csvFilename = 'barrios.csv';
// csv headers
const csvHeaders = ['barrio_id', 'barrio_parent_id', 'barrio_label', 'barrio', 'barrio_alias', 'barrio_desc', 'barrio_zone', 'barrio_central', 'barrio_central_range', 'barrio_active'];



// get csv file ref
const csvFile = path.join(__dirname, csvFilename);
// resolve path
const csvFilePath = path.resolve(csvFile);
// DynamoDB table name, where to insert the data
const tableName = 'Barrios';

// read file
const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


// init output
let records: BarrioCsv[] = [];

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

if (records && records.length > 0) {
  // put the new records in the database...

  // build new mapped objects
  const mappedRecords = records.map<BarrioInput>(r => {
    return {
      barrioId: Number(r.barrio_id),
      parentId: Number(r.barrio_parent_id),
      officialName: r.barrio_label,
      officialNameAccentless: r.barrio,
      barrioSlug: r.barrio_alias.replace('/', '').replace('_', '-').replace('_', '-'),
      barrioZone: Number(r.barrio_zone),
      barrioCentrality: Number(r.barrio_central_range),
    };
  });
  
  console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${tableName}. Please wait...`);
  
  
  // perform PUT operation for each document
  // Warning: running this multiple times will overwrite existing items by ID!
  mappedRecords
  .slice(1, 2) // skip the header row!
  .forEach((theRecord) => {

    const params = {
      TableName: tableName,
      Item: {
        ...theRecord
      },
    };

    docClient.put(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item to the DB",
          theRecord.barrioSlug,
          ". Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log(`PutItem succeeded. ID: ${JSON.stringify(Object.entries(theRecord))}`);
      }
    });

  });
}

