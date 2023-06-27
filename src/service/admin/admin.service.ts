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
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config';

export class AdminService {
  static uploadImage = async (req: any, res: any): Promise<UploadedFile> =>
    imageUploadHandler(req, res);

  static parseFileUploads = async (req: any): Promise<UploadedFile | any> => {
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
      const file = fs.createReadStream(formidableFile.filepath);

      const formData = new FormData();
      formData.append("file", file);

      const tr = new Transform({
        transform(chunk, _encoding, callback) {
          callback(null, chunk);
        },
      });
      formData.pipe(tr);

      // this is for cloudflare images api. you can use any other image upload api
      // const imageReq = await fetch(
      //   "https://api.cloudflare.com/client/v4/accounts/23a1b30d95b2ebe5e7f5fce83318994c/images/v1",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGE_API_KEY}`,
      //       ...formData.getHeaders(),
      //     },
      //     method: "POST",
      //     body: tr as any,
      //     /** @ts-ignore */
      //     duplex: "half",
      //   }
      // );

      // do what you want with the imageObject here

      // const imageObject = (await imageReq.json()).result;

      const newFileKey = `images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg`;
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

      // const command = s3Client.putObject({
      //   Bucket: "barcelonasite",
      //   Key: newFileKey,
      //   // Body: tr,
      //   Body: "Hello S3!",
      // });
      const client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
      const command = new PutObjectCommand({
        Bucket: "barcelonasite",
        Key: newFileKey,
        // Body: tr,
        Body: "Hello S3!",
      });
      try {
        const response = await client.send(command);
        console.log(response);
        return response;
      } catch (err) {
        console.error(err);
      }

      // return imageObject;
      // return res.status(200).json({ imageObject });
    } catch (err) {
      // console.error(err);
      // return res.status(500).json({ error: "Something went wrong" });
      return {
        error: "Something went wrong",
        msg: err,
      };
    }

    // /** Note - we are using v.2.0.0 of formidable! */
    // const form = formidable({});
    // let fields: Fields | null = null;
    // let files: Files | null = null;
    // let error = {
    //   // state: false,
    //   msg: "",
    // };

    // try {
    //   /** @ts-ignore */
    //   [fields, files] = form.parse(req);
    // } catch (err: any) {
    //   // example to check for a very specific error
    //   if (err.code === formidableErrors.maxFieldsExceeded) {
    //   }
    //   error.msg = "Could not parse uploaded files";
    //   // error.state = true;
    //   console.error(err);
    //   // res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
    //   // res.end(String(err));
    // }

    // return {
    //   fields,
    //   files,
    //   error,
    // };
  };
}
export interface UploadedFile {
  fields: Fields | null;
  files: Files | null;
  error: string;
}
