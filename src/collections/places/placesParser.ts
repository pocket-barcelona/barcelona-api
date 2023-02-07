// https://csv.js.org/parse/api/sync/
// RUN this from the project root
// node --loader ts-node/esm ./src/collections/places/placesParser.ts
// For mkdir: "292_montjuic_castle_walls" "293_montjuic_castle_view"

import * as fs from "fs";
import * as path from "path";
import { PlacesCsv } from "./placesCsv.type";
import { fileURLToPath } from 'url';
import { PlaceInput, TABLE_NAME_PLACES } from "../../models/place.model";
import { parse } from "csv-parse/sync";
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";
import { AWSError } from 'dynamoose/dist/aws/sdk';

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
  }, theRecord: TRecord, callback?: (err: AWSError, data: any) => any) {
    
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


const parserService = function<T>(fileContent: string, csvHeaders: string[]) {
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
const csvHeaders: Array<keyof PlacesCsv> = ['place_id','province_id','province','place_town','barrio_id','barrio','type_id','type','place_label','place','place_alias','place_remarks','place_desc','place_time','place_time_enum','place_tod','place_tod_enum','place_commitment','place_physical','place_price','place_free_visit','place_children','place_teenagers','place_popular','place_boost','place_annual_only','place_seasonal','place_daytrip','place_daily','place_sundays','place_landmark','place_requires_booking','place_active','place_zone','place_latlng_accurate','place_lat','place_lng','place_zoom','place_website','place_related_id','place_internal','place_has_image','place_photo_ownership','place_tags','place_check'];
// parse csv file
const records = parserService<PlacesCsv>(fileContent, csvHeaders);

if (records && records.length > 0) {
  
  // put the new records in the database...

  // build new mapped objects
  const mappedRecords = records.map<PlaceInput>(i => {
    return {
      placeId: Number(i.place_id),
      active: Boolean(Number(i.place_active)),
      provinceId: Number(i.province_id),
      placeTown: i.place_town,
      barrioId: Number(i.barrio_id),
      categoryId: Number(i.type_id),
      nameOfficial: i.place_label,
      nameOfficialAccentless: i.place,
      nameEnglish: i.place, // @todo
      urlSlug: i.place_alias,
      remarks: i.place_remarks,
      description: i.place_desc,
      timeRecommended: Number(i.place_time_enum),
      bestTod: Number(i.place_tod_enum),
      commitmentRequired: Number(i.place_commitment),
      // place_physical - deprecated
      price: Number(i.place_price),
      freeToVisit: Number(i.place_free_visit),
      childrenSuitability: Number(i.place_children),
      teenagerSuitability: Number(i.place_teenagers),
      popular: Boolean(Number(i.place_popular)),
      boost: Number(i.place_boost),
      annualOnly: Boolean(Number(i.place_annual_only)),
      seasonal: Boolean(Number(i.place_seasonal)),
      daytrip: Number(i.place_daytrip),
      availableDaily: Boolean(Number(i.place_daily)),
      availableSundays: Boolean(Number(i.place_sundays)),
      physicalLandmark: Boolean(Number(i.place_landmark)),
      requiresBooking: Number(i.place_requires_booking),
      metroZone: Number(i.place_zone),
      latlngAccurate: Boolean(Number(i.place_latlng_accurate)),
      lat: Number(i.place_lat),
      lng: Number(i.place_lng),
      zoom: i.place_zoom === '' ? 0 : Number(i.place_zoom),
      website: i.place_website,
      relatedPlaceId: Number(i.place_related_id),
      hasImage: Boolean(Number(i.place_has_image)),
      imageOwnership: Number(i.place_photo_ownership),
      tags: i.place_tags,
      requiresChecking: Boolean(Number(i.place_check)),
    };
  });
  
  
  console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_PLACES}. Please wait...`);
  
  // perform PUT operation for each document
  // Warning: running this multiple times will overwrite existing items by ID!
  mappedRecords
  .slice(1) // skip the header row!
  .forEach((theRecord) => {
    
    const params = {
      TableName: TABLE_NAME_PLACES,
      Item: {
        ...theRecord
      } as any,
    };
    console.log('The record:', theRecord.nameEnglish);

    const dynamoService = new CustomDynamoService();
    dynamoService.putRecord(params, theRecord);

  });
}

