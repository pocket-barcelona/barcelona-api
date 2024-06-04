import type { Request, Response } from "express";
import "dotenv/config";
// import { imageUploadHandler } from "./functions";
import formidable, {
  type Fields,
  type Files,
  errors as formidableErrors,
} from "formidable";
import fs from "node:fs";
import { PassThrough, Transform } from "node:stream";
import { PutObjectCommand, type PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import urlSlug from "url-slug";
import s3Client from "../../utils/s3.client";
import type { PostImage } from "../../models/post.model";

const IMAGE_FILESIZE_MAX = 2 * 1024 * 1024; // 2MB

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AdminService {
  // static uploadImage = async (req: any, res: any): Promise<any> =>
  //   imageUploadHandler(req, res);

  /**
   * Parse the HTTP form data in the POST request using Formidable and extract the user's files and post data
   * @param req
   * @returns
   */
  static async parseFile(req: Request<unknown>): Promise<{
    files: formidable.Files;
    fields: formidable.Fields;
  }> {
    return new Promise<{
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
  }

  /** Get the POSTed file and field data and validate */
  static async getFileUploadData(req: unknown): Promise<{
    formidableFile: formidable.File;
    fields: formidable.Fields;
  }> {
    const { files, fields } = await AdminService.parseFile(req);
    // const file = fs.createReadStream(formidableFile.filepath);
    // get the file
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
      throw new Error("No field information provided");
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

    // make sure postID is valid
    if (!fields.postId || fields.postId.length !== 36) {
      throw new Error("Invalid post ID");
    }

    return {
      formidableFile,
      fields,
    };
  }

  static handleFileUploads = async ({
    formidableFile,
    fields,
  }: {
    formidableFile: formidable.File;
    fields: formidable.Fields;
  }): Promise<
    | {
        object: PutObjectCommandOutput;
        fields: formidable.Fields;
        uploadedFile: PostImage;
      }
    | false
  > => {
    // https://stackoverflow.com/questions/72568850/nodejs-fetch-failed-object2-is-not-iterable-when-uploading-file-via-post-reque
    try {
      // const { fields, formidableFile } = await AdminService.getFileUploadData(req);
      const { originalFilename, mimetype } = formidableFile;

      const {
        imageAlt = "",
        imageTitle = "",
        postId = "",
      } = fields as { imageAlt: string; imageTitle: string; postId: string };

      // build file key
      const fileExtension = (originalFilename ?? "").split(".").pop();
      if (!fileExtension) {
        throw new Error("Invalid file extension");
      }

      // read file
      let blob: Buffer;
      try {
        blob = fs.readFileSync(formidableFile.filepath);
      } catch (error) {
        throw new Error("Error reading file");
      }

      const { newFileKey, safeFilename } = AdminService.buildFileKey({
        imageTitle,
        fileExtension,
        postId,
      });

      const command = AdminService.buildPutCommand({
        newFileKey,
        blob,
        mimetype,
      });

      const uploadedFile: PostImage = {
        // assign the file a unique ID for later
        imageId: uuidv4(),
        imageUrl: newFileKey,
        imageName: safeFilename,
        imageTitle: imageTitle,
        imageAlt: imageAlt,
      };

      try {
        const response = await s3Client.send(command);
        // console.log(response);
        // s3Client.getSignedUrl()
        return {
          object: response,
          fields,
          uploadedFile,
        };
      } catch (err) {
        // console.error(err);
      }
    } catch (err: any) {
      throw new Error(err);
      // nothing
    }
    // return a throw
    throw new Error("Something went wrong");

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

  /**
   * Build the S3 file object key based on the image title, file extension and post ID
   * New file keys are like this: images/blog/[POST_ID]/[FILENAME].jpg
   * images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg
   * const newFileKey = `images/blog/78403041-2319-4613-8042-046154d648ec/paradise2.jpg`;
   * @returns
   */
  static buildFileKey({
    imageTitle,
    fileExtension,
    postId,
  }: {
    imageTitle: string;
    fileExtension: string;
    postId: string;
  }): {
    /** The object key on S3 */
    newFileKey: string;
    /** The filename like "my-new-file-abcd1234.jpg" */
    safeFilename: string;
  } {
    // base path folders for where the images are on S3
    const imageFolderBase: string[] = ["images", "blog"];

    // start building a filename...
    let smallUuid = uuidv4();
    // create an 8 char UUID-like string - it will be unique enough!
    smallUuid = smallUuid.substring(0, 8);
    // build a url slug based on image title from user - will include chars [a-z0-9-] and no spaces
    let safeFilename = urlSlug(imageTitle);
    safeFilename = (safeFilename || "myfile")
      .concat("-")
      .concat(smallUuid)
      .concat(".")
      .concat(fileExtension);
    // return full path
    return {
      newFileKey: imageFolderBase.concat([postId, safeFilename]).join("/"),
      safeFilename,
    };
  }

  /**
   * @url https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/s3/actions/put-object.js#L8
   * @url https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_PutObject_section.html
   * @returns PutObjectCommand
   */
  static buildPutCommand({
    newFileKey,
    blob,
    mimetype,
  }: {
    newFileKey: string;
    blob: Buffer;
    mimetype: string | null;
  }): PutObjectCommand {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: newFileKey,
      Body: blob,
      // @todo - we need to remove this when we resolve the DNS to the bucket and add a policy...
      // ACL: "public-read", // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
      ContentType: mimetype ?? "image/jpeg",
      ContentLength: blob.length,
    });
    return command;
  }
}
export interface UploadedFile {
  fields: Fields | null;
  files: Files | null;
  error: string;
}
