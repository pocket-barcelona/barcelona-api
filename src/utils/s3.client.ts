import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';
// import { File } from 'formidable';
// import { PassThrough } from 'node:stream';

/**
 * Support for uploading files to AWS S3 bucket
 * Also for using formidable - https://github.com/node-formidable/formidable/tree/master
 */
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export default s3Client;

// FOR SOME REASON THIS IS NOT THE SAME AS THE ONE ABOVE! MAYBE DIFF PACKAGE VERSION?
// const s3Client = new AWS.S3({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });


// export const uploadStream = (file: File) => {
//   const newFileKey = `images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg`;
//   const pass = new PassThrough();
//   s3Client.upload(
//     {
//       Bucket: 'demo-bucket',
//       Key: file.newFilename,
//       Body: pass,
//     },
//     (err, data) => {
//       console.log(err, data);
//     },
//   );

//   return pass;
// };
