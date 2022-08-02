// RUN this from the project root
// node --loader ts-node/esm ./src/collections/googleplaces/googleplacesParser.ts


import * as fs from "fs";
import * as path from "path";
import { GooglePlacesJsonType } from "./googleplacesJson.type";
import { fileURLToPath } from 'url';
import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";
import { AWSError } from 'dynamoose/dist/aws/sdk';
import { PoiInput } from "../../models/poi.model";
// import { CategoryIdEnum } from "../../models/enums/categoryid.enum";
// import { RequiresBookingEnum } from "./../../models/enums/requiresbooking.enum";

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

// json file to import
const jsonFilename = 'data.json';
// get json file ref
const jsonFile = path.join(__dirname, jsonFilename);
// resolve path
const jsonFilePath = path.resolve(jsonFile);
// read file
const fileContent = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });

// DynamoDB table name, where to insert the data
const tableName = 'Poi';


let rawData: GooglePlacesJsonType | undefined;
try {
  rawData = JSON.parse(fileContent) as GooglePlacesJsonType;
} catch (error: any) {
  throw new Error(error);
}
if (!rawData) {
  throw new Error('No data to add to the DB!');
}

const hasRecords = rawData && rawData.features && rawData.features.length > 0;
if (!hasRecords) {
  throw new Error('No data to insert');
}

const mappedRecords = rawData.features.map<PoiInput>((r, mapIndex) => {
  return {
    poiId: 1,
    active: true,
    provinceId: 2, // logic here
    barrioId: 86, // logic here
    // categoryId: CategoryIdEnum.BarsRestaurants,
    categoryId: 2,
    nameOfficial: r.properties.Location["Business Name"],
    nameOfficialAccentless: r.properties.Location["Business Name"], // logic here
    urlSlug: r.properties.Location["Business Name"], // logic here
    description: '',
    bestTod: 0,
    price: 0,
    boost: 0,
    // requiresBooking: RequiresBookingEnum.No,
    requiresBooking: 1,
    lat: r.geometry.coordinates[0],
    lng: r.geometry.coordinates[1],
    latlngAccurate: r.geometry.type === 'Point',
    countryCode: r.properties.Location["Country Code"] || 'ES',
    website: '',
    tags: '',
  };
});

// put the new records in the database...

console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${tableName}. Please wait...`);

// perform PUT operation for each document
// Warning: running this multiple times will overwrite existing items by ID!
mappedRecords
.slice(0, 5)
.forEach((theRecord) => {
  
  const params = {
    TableName: tableName,
    Item: {
      ...theRecord
    } as any,
  };
  console.log('The record: ', theRecord.nameOfficial);

  const dynamoService = new CustomDynamoService();
  dynamoService.putRecord(params, theRecord);

});
