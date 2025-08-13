// // https://csv.js.org/parse/api/sync/
// // RUN this from the project root
// // node --loader ts-node/esm ./src/collections/places/placesParser.ts
// // Should work:
// // node --experimental-specifier-resolution=node --loader ts-node/esm ./src/collections/places/placesParser.ts
// // For mkdir: "292_montjuic_castle_walls" "293_montjuic_castle_view"

// import * as fs from "node:fs";
// import * as path from "node:path";
// import type { PlacesCsv } from "./placesCsv.type.js";
// import { fileURLToPath } from 'node:url';
// import { type PlaceInput, TABLE_NAME_PLACES } from "../../models/place.model.js";
// import { parse } from "csv-parse/sync";
// import 'dotenv/config'; // support for dotenv injecting into the process env
// import AWS from "aws-sdk";
// import { ServiceException } from '@smithy/smithy-client';
// import { DynamoDBDocument, PutCommandInput } from '@aws-sdk/lib-dynamodb';
// import { DynamoDB } from '@aws-sdk/client-dynamodb';
// import type { AWSError } from 'dynamoose/dist/aws/sdk';

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
//   }, theRecord: TRecord, callback?: (err: ServiceException, data: PlaceInput) => any) {

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

// // csv file to import
// const csvFilename = 'data.csv';
// // get csv file ref
// const csvFile = path.join(__dirname, csvFilename);
// // resolve path
// const csvFilePath = path.resolve(csvFile);
// // read file
// const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

// const parserService = <T>(fileContent: string, csvHeaders: string[]) => {
//   // init output
//   let records: T[] = [];

//   // parse
//   try {
//     records = parse(fileContent, {
//       delimiter: ',',
//       columns: csvHeaders,
//       skip_empty_lines: true,
//     });
//   } catch (error) {
//     console.error(error);
//   }
//   return records;
// }

// // CSV-SPECIFIC DATA...

// // csv headers
// const csvHeaders: Array<keyof PlacesCsv> = ['placeId','provinceId','placeTown','barrioId','categoryId','active', 'hasImage','labelCat','labelEsp','labelEng','slug','remarks','description','timeRecommendedEnum','bestTodEnum','commitmentRequiredEnum','priceEnum','freeToVisit','childrenSuitability','teenagersSuitability','touristAttraction','popular','boost','annualOnly','seasonal','daytrip','availableDaily','availableSundays','requiresBooking','metroZone','isLandmark','isPhysicalLocation','lat','lng','latLngAccurate','mapZoom','website','relatedPlaceId','photoOwnership','tags'];
// // parse csv file
// const records = parserService<PlacesCsv>(fileContent, csvHeaders);

// if (records && records.length > 0) {

//   // put the new records in the database...

//   // build new mapped objects
//   const mappedRecords = records.map<PlaceInput>(i => {
//     return {
//       placeId: Number(i.placeId),
//       active: Boolean(Number(i.active)),
//       provinceId: Number(i.provinceId),
//       placeTown: i.placeTown,
//       barrioId: Number(i.barrioId),
//       categoryId: Number(i.categoryId),
//       hasImage: Boolean(Number(i.hasImage)),
//       labelCat: i.labelCat,
//       labelEsp: i.labelEsp,
//       labelEng: i.labelEng,
//       slug: i.slug,
//       remarks: i.remarks,
//       description: i.description,
//       timeRecommended: Number(i.timeRecommendedEnum),
//       bestTod: Number(i.bestTodEnum),
//       commitmentRequired: Number(i.commitmentRequiredEnum),
//       price: Number(i.priceEnum),
//       freeToVisit: Number(i.freeToVisit),
//       childrenSuitability: Number(i.childrenSuitability),
//       teenagerSuitability: Number(i.teenagersSuitability),
//       touristAttraction: Boolean(Number(i.touristAttraction)),
//       popular: Boolean(Number(i.popular)),
//       boost: Number(i.boost),
//       annualOnly: Boolean(Number(i.annualOnly)),
//       seasonal: Boolean(Number(i.seasonal)),
//       daytrip: Number(i.daytrip),
//       availableDaily: Boolean(Number(i.availableDaily)),
//       availableSundays: Boolean(Number(i.availableSundays)),
//       requiresBooking: Number(i.requiresBooking),
//       metroZone: Number(i.metroZone),
//       isLandmark: Boolean(Number(i.isLandmark)),
//       isPhysicalLocation: Number(i.isPhysicalLocation),
//       lat: Number(i.lat),
//       lng: Number(i.lng),
//       latlngAccurate: Boolean(Number(i.latLngAccurate)),
//       mapZoom: i.mapZoom === '' ? 0 : Number(i.mapZoom),
//       website: i.website,
//       relatedPlaceId: Number(i.relatedPlaceId),
//       photoOwnership: Number(i.photoOwnership),
//       tags: i.tags,
//     };
//   });

//   console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_PLACES}. Please wait...`);

//   // perform PUT operation for each document
//   // Warning: running this multiple times will overwrite existing items by ID!
//   // biome-ignore lint/complexity/noForEach: <explanation>
//   mappedRecords
//   .slice(1) // skip the header row!
//   .forEach((theRecord) => {

//     const params = {
//       TableName: TABLE_NAME_PLACES,
//       Item: {
//         ...theRecord
//       } as any,
//     };
//     console.log('The record:', theRecord.labelEng);

//     const dynamoService = new CustomDynamoService();
//     dynamoService.putRecord(params, theRecord); // overwrites existing data!!!

//   });
// }

