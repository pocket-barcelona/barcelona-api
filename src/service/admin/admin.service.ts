import { imageUploadHandler } from "./functions";
import formidable, {
  Fields,
  Files,
  errors as formidableErrors,
} from "formidable";
import FormData from "form-data";
import fs from "fs";
// import type { NextApiRequest, NextApiResponse } from 'next';
import { PassThrough, Transform } from "stream";
import s3Client from "../../utils/s3.client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
export class AdminService {
  static uploadImage = async (req: any, res: any): Promise<UploadedFile> =>
    imageUploadHandler(req, res);

  static parseFileUploads = async (req: any): Promise<UploadedFile | any> => {
    // https://stackoverflow.com/questions/72568850/nodejs-fetch-failed-object2-is-not-iterable-when-uploading-file-via-post-reque
    try {
      const parseFile = () =>
        new Promise<formidable.Files>((resolve, reject) => {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, _fields, files) => {
            if (err) {
              reject(err);
            }
            resolve(files);
          });
        });

      const files = await parseFile();
      const formidableFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;
      // const file = fs.createReadStream(formidableFile.filepath, "binary");
      // const file = fs.createReadStream(formidableFile.filepath);
      
      const blob = fs.readFileSync(formidableFile.filepath);
      // file.on("error", function (error) {
      //   console.log(`error: ${error.message}`);
      // });

      // file.on("data", (chunk) => {
      //   console.log(chunk);
      // });

      // const formData = new FormData();

      // formData.append("file", file);

      // const tr = new Transform({
      //   transform(chunk, _encoding, callback) {
      //     callback(null, chunk);
      //   },
      // });
      // file.pipe(tr).on("error", (err) => {
      //   console.log(err);
      // }).on("end", () => {
      //   console.log("end");
      // });
      // formData.pipe(tr);

      

      // new file keys are like this: images/blog/[POST_ID]/[FILENAME].jpg
      // images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg
      const newFileKey = `images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg`;
      // https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/put-object.js#L8
      // https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_PutObject_section.html
      const command = new PutObjectCommand({
        Bucket: "barcelonasite",
        Key: newFileKey,
        Body: blob,
        // Body: file.read(),
        // Body: file,
        // Body: file.read(),
        // Body: JSON.stringify(formData),
        // Body: formData.getBuffer(),
        // Body: formData.get('file'),
        // Body: file.read(),
        ACL: "public-read", // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
        // ContentLength: file.
        ContentType: formidableFile.mimetype ?? 'image/jpeg',
        ContentLength: blob.length,
      });
      try {
        const response = await client.send(command);
        console.log(response);
        return response;
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      // console.error(err);
      // return res.status(500).json({ error: "Something went wrong" });
      return {
        error: "Something went wrong",
        msg: err,
      };
    }

    // const newFileKey = `paradise2.jpg`;
    // const pass = new PassThrough();
    // const uploaded = s3Client.upload(
    //   {
    //     Bucket: "barcelonasite",
    //     // Key: file.newFilename,
    //     Key: newFileKey,
    //     // Body: pass,
    //     Body: tr,
    //   },
    //   (err, data) => {
    //     console.log(err, data);
    //   }
    // );

    // try {
    //   const command = s3Client.putObject({
    //     Bucket: "barcelonasite",
    //     Key: newFileKey,
    //     // Body: tr,
    //     Body: "Hello S3!",
    //   });
    //   command.send();
    //   return {
    //     command,
    //   }

    // } catch (error) {
    //   console.log(error);
    //   return {error}
    // }
  };
}
export interface UploadedFile {
  fields: Fields | null;
  files: Files | null;
  error: string;
}
