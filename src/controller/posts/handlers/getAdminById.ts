import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PostsService } from "../../../service/posts/posts.service";
import { ReadPostInput } from "../../../schema/post/post.schema";

/**
 * Get a blog post by ID - for CMS, regardless of status
 * @param req
 * @param res
 * @returns
 */
export default async function getAdminById(
  req: Request<ReadPostInput["params"]>,
  res: Response
) {
  const postId = req.params.postId;
  if (!postId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Please provide a post ID", res.statusCode));
  }

  const record = await PostsService.getById(postId);

  if (!record) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting item", res.statusCode));
  }
  return res.send(success(record));
}
