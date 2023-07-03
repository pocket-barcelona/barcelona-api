import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AdminService } from "../../../service/admin/admin.service";
import { error, success } from "../../../middleware/apiResponse";
import FormData from "form-data";
import { PostsService } from "../../../service/posts/posts.service";

const MAX_IMAGES_PER_POST = 20;

export default async function (req: Request<any>, res: Response) {
  try {
    const { fields, formidableFile } = await AdminService.getFileUploadData(
      req
    );

    // make sure post exists...
    const post = await PostsService.getById(fields.postId as string);
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(error("Post not found", res.statusCode));
    }

    if (post.postImages.length >= MAX_IMAGES_PER_POST) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send(error(`Too many images for this post. The maximum allowed is ${MAX_IMAGES_PER_POST}`, res.statusCode));
    }

    // @todo - use admin service for this...so can ignore published status

    const uploadedSuccess = await AdminService.handleFileUploads({
      fields,
      formidableFile,
    });

    if (false === uploadedSuccess) {
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .send(error("Error uploading file, please try again", res.statusCode));
    }

    const { fields: parsedFields, object: newS3Object, uploadedFile } = uploadedSuccess;
    
    // if file uploaded to S3, update post images array
    // const updatedPost = await PostService.updatePost(req.params.id, req.body);

    post.postImages.push(uploadedFile);
    await post.save();

    return res.send(success(uploadedFile, {
      meta: {
        object: newS3Object,
        fields: parsedFields,
        post: post,
      }
    }));

  } catch (err: any) {
    if (err && err.message) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send(error(err.message, res.statusCode));
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(error("Error uploading file", res.statusCode));
    }
  }
}
