import { imageUploadHandler } from "./functions";
import formidable, {
  Fields,
  Files,
  errors as formidableErrors,
} from "formidable";
import FormData from "form-data";
import fs from "fs";
import { PassThrough, Transform } from "stream";
import s3Client from "../../utils/s3.client";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";
import { v4 as uuidv4 } from 'uuid';
import urlSlug from 'url-slug'
const IMAGE_FILESIZE_MAX = 2 * 1024 * 1024; // 2MB

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
        new Promise<{
          files: formidable.Files;
          fields: formidable.Fields;
        }>((resolve, reject) => {
          const form = new formidable.IncomingForm();
          form.parse(req, async (err, fields, files) => {
            if (err) {
              reject(err);
            }
            resolve({ files, fields });
          });
        });

      const { files, fields } = await parseFile();
      // const file = fs.createReadStream(formidableFile.filepath);
      const formidableFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;
      

      // validation here...
      // check imageTitle is provided
      // check imageAlt is provided
      if (!formidableFile || !formidableFile.filepath) {
        throw new Error("No file provided!");
      }
      if (!fields) {
        throw new Error("No file information provided");
      }
      if (!fields.imageTitle) {
        throw new Error("No image title provided");
      }
      if (!fields.imageAlt) {
        throw new Error("No image alt provided");
      }

      // check file size
      // check mime type
      // generate safe/unique file name based on file title
      
      const { mimetype, size: fileSize, originalFilename } = formidableFile;
      if (fileSize > IMAGE_FILESIZE_MAX) {
        throw new Error("File size too large!");
      }
      if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
        // only allow jpg or png
        throw new Error("File type not supported!");
      }
      
      const { imageAlt = '', imageTitle = '', postId = '' } = fields as { imageAlt: string; imageTitle: string; postId: string };
      // make sure postID is valid
      if (!postId || postId.length !== 36) {
        throw new Error("Invalid post ID");
      }
      
      // read file
      let blob: Buffer;
      try {
        blob = fs.readFileSync(formidableFile.filepath);
      } catch (error) {
        throw new Error("Error reading file");
      }


      // new file keys are like this: images/blog/[POST_ID]/[FILENAME].jpg
      // images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg
      // const newFileKey = `images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg`;

      // build file key
      const fileExtension = (originalFilename ?? '').split(".").pop();
      if (!fileExtension) {
        throw new Error("Invalid file extension");
      }
      
      // base path folders for where the image are on S3
      const imageFolderBase: string[] = ['images', 'blog'];
      
      // start building a filename...
      let smallUuid = uuidv4();
      smallUuid = smallUuid.substring(0, 8);
      let safeFilename = urlSlug(imageTitle);
      safeFilename = (safeFilename || 'myfile').concat("-").concat(smallUuid).concat(".").concat(fileExtension);

      const newFileKey = imageFolderBase.concat([postId, safeFilename]).join('/');
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
        ContentType: mimetype ?? "image/jpeg",
        ContentLength: blob.length,
      });
      
      // return {
      //   done: true,
      // };

      try {
        const response = await client.send(command);
        // console.log(response);
        // s3Client.getSignedUrl()
        return response;
      } catch (err) {
        console.error(err);
      }
    } catch (err: any) {
      // console.error(err);
      // return res.status(500).json({ error: "Something went wrong" });
      return {
        error: "Something went wrong",
        msg: err && err.message ? err.message : "Error!",
      };
    }


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
