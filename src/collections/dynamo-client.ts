// import 'dotenv/config'; // support for dotenv injecting into the process env
// // import AWS from "aws-sdk";
// import type { ServiceException } from '@smithy/smithy-client';
// import { DynamoDBDocument, type PutCommandInput } from '@aws-sdk/lib-dynamodb';
// import { DynamoDB } from '@aws-sdk/client-dynamodb';

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
// // export default docClient;

// export class CustomDynamoService {

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
