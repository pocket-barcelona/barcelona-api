import 'dotenv/config'; // support for dotenv injecting into the process env
import AWS from "aws-sdk";
import type { AWSError } from 'dynamoose/dist/aws/sdk';

// set AWS config for client
AWS.config.update({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const docClient = new AWS.DynamoDB.DocumentClient();
// export default docClient;

export class CustomDynamoService {

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
