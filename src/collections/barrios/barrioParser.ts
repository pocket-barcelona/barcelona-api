import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/sync';
import { BarrioCsv } from "./barrioCsv.type";
import { fileURLToPath } from 'url';
import { BarrioInput } from "../../models/barrio.model";
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = new AWS.DynamoDB.DocumentClient();

// https://csv.js.org/parse/api/sync/

// RUN this from the project root
// node --loader ts-node/esm ./src/collections/barrios/barrioParser.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log('directory-name 👉️', __dirname);
const csvFile = path.join(__dirname, 'barrios.csv');

let barriosList: BarrioCsv[] = [];

// const csvFilePath = path.resolve(path.dirname('./barrios.csv'));
const csvFilePath = path.resolve(csvFile);

// csv headers
const headers = ['barrio_id', 'barrio_parent_id', 'barrio_label', 'barrio', 'barrio_alias', 'barrio_desc', 'barrio_zone', 'barrio_central', 'barrio_central_range', 'barrio_active'];
// read file
const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

// init output
let records: BarrioCsv[] = [];

// parse
try {
  records = parse(fileContent, {
    delimiter: ',',
    columns: headers,
    skip_empty_lines: true,
  });
} catch (error) {
  console.error(error);
}

if (records && records.length > 0) {

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

  // put the new records in the database
  const tableName = 'Barrios';
  
  console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${tableName}. Please wait...`);
  
  // example with JSON
  // const allRecords = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));

  // console.log(mappedRecords
  //   .slice(1));
  
  mappedRecords
  .slice(1) // skip the header row!
  .forEach((theRecord) => {
    const params = {
      TableName: tableName,
      Item: {
        ...theRecord
      },
    };
  
    // Warning: running this multiple times will overwrite existing items by ID!
    docClient.put(params, (err, data) => {
      if (err) {
        console.error(
          "Unable to add item to the DB",
          theRecord.barrioSlug,
          ". Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log(`PutItem succeeded. ID: ${theRecord.barrioId} - ${theRecord.barrioSlug}`);
      }
    });

  });
}

