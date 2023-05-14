import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PostsService } from "../../../service/posts/posts.service";
import { CreatePostInput } from '../../../schema/post/post.schema';

/**
 * Create a new blog post
 * @param req
 * @param res
 * @returns
 */
export default async function createPost(
  req: Request<{}, {}, CreatePostInput["body"]>,
  res: Response) {
  
  const newItem = await PostsService.createPost(req.body);

  // send a useful data validation message
  if (typeof newItem === "string") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error(newItem, res.statusCode));
  }

  if (newItem) {
    return res.send(success(newItem));
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .send(error("Invalid data", res.statusCode));
}
