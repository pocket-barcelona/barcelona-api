// // RUN this from the project root
// // node --loader ts-node/esm ./src/collections/googleplaces/googleplacesParser.ts
// // IF DOES NOT WORK:
// // node --experimental-specifier-resolution=node --loader ts-node/esm ./src/collections/googleplaces/googleplacesParser.ts

// import * as fs from "node:fs";
// import * as path from "node:path";
// import type { GooglePlacesJsonType } from "./googleplacesJson.type";
// import { fileURLToPath } from 'node:url';
// import 'dotenv/config'; // support for dotenv injecting into the process env
// import AWS from "aws-sdk";
// import { ServiceException } from '@smithy/smithy-client';
// import { DynamoDBDocument, PutCommandInput } from '@aws-sdk/lib-dynamodb';
// import { DynamoDB } from '@aws-sdk/client-dynamodb';
// import type { AWSError } from 'dynamoose/dist/aws/sdk';
// import { type PoiInput, TABLE_NAME_POI } from "../../models/poi.model";
// // import { CategoryIdEnum } from "../../models/enums/categoryid.enum";
// // import { RequiresBookingEnum } from "./../../models/enums/requiresbooking.enum";
// import urlSlug from 'url-slug'
// import type { TimeOfDayEnum } from '../../models/enums/tod.enum';

// // set AWS config for client
// // JS SDK v3 does not support global configuration.
// // Codemod has attempted to pass values to each service client in this file.
// // You may need to update clients outside of this file, if they use global config.
// AWS.config.update({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
//   },
// });
// const docClient = DynamoDBDocument.from(new DynamoDB());


// class CustomDynamoService {

//   public putRecord<TRecord extends PutCommandInput = any>(params: {
//     TableName: string;
//     Item: TRecord;
//   }, theRecord: TRecord, callback?: (err: ServiceException, data: any) => any) {
    
//     docClient.put(params, (err, data) => {
//       if (err) {
//         console.error(
//           "Unable to add item to the DB",
//           ". Error JSON:",
//           JSON.stringify(err, null, 2)
//         );
//       } else {
//         console.log(`PutItem succeeded. ID: ${JSON.stringify(Object.entries(theRecord))}`);
//       }
//     });
//   }
// }

// // get path, since __dirname is not available!
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // json file to import
// const jsonFilename = 'data.json';
// // get json file ref
// const jsonFile = path.join(__dirname, jsonFilename);
// // resolve path
// const jsonFilePath = path.resolve(jsonFile);
// // read file
// const fileContent = fs.readFileSync(jsonFilePath, { encoding: 'utf-8' });



// let rawData: GooglePlacesJsonType | undefined;
// try {
//   rawData = JSON.parse(fileContent) as GooglePlacesJsonType;
// } catch (error: any) {
//   throw new Error(error);
// }
// if (!rawData) {
//   throw new Error('No data to add to the DB!');
// }

// const hasRecords = rawData?.features && rawData.features.length > 0;
// if (!hasRecords) {
//   throw new Error('No data to insert');
// }

// function getUrlSlug(str: string): string {
//   return urlSlug(str);
// }

// const summary: string[] = [];

// const mappedRecords = rawData.features
// .map<PoiInput | undefined>((r, mapIndex) => {
//   // Remove accents/diacritics from the business name (é -> e)
//   const businessName: string = r.properties.Location["Business Name"] ?? '';
//   if (!businessName) {
//     if (summary.length < 100) {
//       summary.push(`No business name found at index ${mapIndex} for ${r.properties.Title ?? 'Unknown place'}`);
//     }
//     return undefined;
//   }

//   let nameWithoutDiacritics = '';
//   try {
//     nameWithoutDiacritics = businessName.normalize("NFD").replace(/\p{Diacritic}/gu, "");
//   } catch (error: any) {
//     console.log(error.message ? error.message : error);
//     throw new Error(error);
//   }
//   if (!nameWithoutDiacritics) return undefined;

//   const slug = getUrlSlug(nameWithoutDiacritics);
//   return {
//     poiId: (`${mapIndex + 1}`),
//     active: true,
//     provinceId: 2, // logic here
//     barrioId: 86, // logic here
//     // categoryId: CategoryIdEnum.BarsRestaurants,
//     categoryId: 2,
//     nameOfficial: businessName,
//     nameOfficialAccentless: nameWithoutDiacritics,
//     urlSlug: slug,
//     address: r.properties.Location.Address ?? '',
//     description: '',
//     bestTod: 0 as TimeOfDayEnum, // @todo - fix this
//     price: 0,
//     boost: 0,
//     // requiresBooking: RequiresBookingEnum.No,
//     requiresBooking: 1,
//     lat: Number.parseFloat(r.properties.Location["Geo Coordinates"].Latitude),
//     lng: Number.parseFloat(r.properties.Location["Geo Coordinates"].Longitude),
//     latlngAccurate: r.geometry.type === 'Point',
//     countryCode: r.properties.Location["Country Code"] || '',
//     website: '',
//     tags: '',
//   };
// });

// // show a summary for debugging
// // if (summary.length > 0) {
// //   console.warn('Errors: ', summary);
// //   throw new Error('Errors occurred');
// // }



// const DRYRUN = false;
// const STAGGER = true;
// const STAGGER_DURATION = 300;


// // perform PUT operation for each document
// // Warning: running this multiple times will overwrite existing items by ID!
// const filteredRecords = mappedRecords
// .filter(r => {
//   // console.log(r);
//   if (r === undefined) return false;
//   if (r.countryCode !== 'ES') return false;
//   return true;
// })
// .slice(0, 50)

// if (filteredRecords.length <= 0) {
//   throw new Error('Nothing to do!');
// }

// // put the new records in the database...

// console.log(`Importing ${filteredRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_POI}. Please wait...`);

// filteredRecords.forEach((theRecord, i) => {

//   setTimeout(() => {
    
//     if (DRYRUN) {
//       // console.log('The record: ', theRecord.nameOfficial);
//       console.log('The record: ', theRecord);
//     } else {
  
//       const params = {
//         TableName: TABLE_NAME_POI,
//         Item: {
//           ...theRecord
//         } as any,
//       };
    
//       const dynamoService = new CustomDynamoService();
//       dynamoService.putRecord(params, theRecord);
//     }

//   }, STAGGER ? (STAGGER_DURATION * i) : 1);

// });
