import { Request, Response } from "express";
import { AdminService, UploadedFile } from '../admin.service';

// const { Upload } = require("@aws-sdk/lib-storage");
// const { S3Client } = require("@aws-sdk/client-s3");
// const Transform = require("stream").Transform;

// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const region = process.env.S3_REGION;
// const Bucket = process.env.S3_BUCKET;

// import http from "node:http";

/**
 * Upload an image to S3
 * @returns
 */
export default async function (req: Request<any>, res: any): Promise<UploadedFile> {

  const resp = await AdminService.parseFileUploads(req);
  return resp;
  // return true;
  // // parse a file upload
  // const form = formidable({
  //   fileWriteStreamHandler: uploadStream,
  // });

  // form.parse(req, () => {
  //   res.writeHead(200);
  //   res.end();
  // });

  // const form = formidable({});

  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     next(err);
  //     return;
  //   }
  //   res.json({ fields, files });
  // });

  // // await fileparser(req)
  // //   .then((data) => {
  // //     res.status(200).json({
  // //       message: "Success",
  // //       data,
  // //     });
  // //   })
  // //   .catch((error) => {
  // //     res.status(400).json({
  // //       message: "An error occurred.",
  // //       error,
  // //     });
  // //   });

  // return true;
}
