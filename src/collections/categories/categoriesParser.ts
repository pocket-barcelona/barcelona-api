// // https://csv.js.org/parse/api/sync/
// // RUN this from the project root
// // node --loader ts-node/esm ./src/collections/categories/categoriesParser.ts
// // IF DOES NOT WORK:
// // node --experimental-specifier-resolution=node --loader ts-node/esm ./src/collections/categories/categoriesParser.ts

// import * as fs from "node:fs";
// import * as path from "node:path";
// import type { CategoriesCsv } from "./categoriesCsv.type";
// import { fileURLToPath } from 'node:url';
// import { type CategoryInput, TABLE_NAME_CATEGORY } from "../../models/category.model";
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

// // csv file to import
// const csvFilename = 'data.csv';
// // get csv file ref
// const csvFile = path.join(__dirname, csvFilename);
// // resolve path
// const csvFilePath = path.resolve(csvFile);
// // read file
// const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });


// const parserService = function<T>(fileContent: string, csvHeaders: string[]) {
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
// const csvHeaders: Array<keyof CategoriesCsv> = ['type_id','type_active','type_label','type_alias','type_icon','type_poster','type_visited_by'];
// // parse csv file
// const records = parserService<CategoriesCsv>(fileContent, csvHeaders);

// if (records && records.length > 0) {
  
//   // put the new records in the database...

//   // build new mapped objects
//   const mappedRecords = records.map<CategoryInput>(r => {
//     return {
//       categoryId: Number(r.type_id),
//       label: r.type_label,
//       urlSlug: r.type_alias,
//       icon: r.type_icon,
//       poster: r.type_poster,
//       suitableFor: r.type_visited_by,
//     };
//   });
  
//   console.log(`Importing ${mappedRecords.length} record/s into the DynamoDB inside table: ${TABLE_NAME_CATEGORY}. Please wait...`);
  
//   // perform PUT operation for each document
//   // Warning: running this multiple times will overwrite existing items by ID!
//   // biome-ignore lint/complexity/noForEach: <explanation>
//   mappedRecords
//   .slice(1) // skip the header row!
//   .forEach((theRecord) => {
    
//     const params = {
//       TableName: TABLE_NAME_CATEGORY,
//       Item: {
//         ...theRecord
//       } as any,
//     };

//     const dynamoService = new CustomDynamoService();
//     dynamoService.putRecord(params, theRecord);

//   });
// }

