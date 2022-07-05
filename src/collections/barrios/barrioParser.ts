import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/sync';
import { BarrioCsv } from "./barrioCsv.type";
import { fileURLToPath } from 'url';
import { BarrioInput } from "../../models/barrio.model";
// import AWS from "aws-sdk";

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
  });
} catch (error) {
  console.error(error);
}

if (records && records.length > 0) {

  const mappedRecords = records.map(r => {
    const newRecord: BarrioInput = {
      barrioId: Number(r.barrio_id),
      parentId: Number(r.barrio_parent_id),
      officialName: r.barrio_label,
      officialNameAccentless: r.barrio,
      barrioSlug: r.barrio_alias.replace('/', '').replace('_', '-'),
      barrioZone: Number(r.barrio_zone),
      barrioCentrality: Number(r.barrio_central_range),
    };
    return newRecord;
  });

  // put the new records in the database
  console.log([
    {
      ...mappedRecords[1]
    }
  ]);
}

// console.log(barriosList);