import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UpdatePostInput } from '../../../schema/post/post.schema';
import type { PostDocument } from '../../../models/post.model';
import { PostsService } from '../../../service/posts/posts.service';

/**
 * Patch a post by updating one or more fields
 * @param req
 * @param res
 */
export default async function updatePost(
  req: Request<UpdatePostInput["params"], unknown, UpdatePostInput["body"]>,
  res: Response
) {
  const { postId } = req.params;
  const itemExists = await PostsService.getById(postId);

  if (!itemExists) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Item not found", res.statusCode));
  }

  // const loggedInUser = (res.locals.user as UserDocument).userId || "";
  // // @todo - allow super users to edit events?
  // if (itemExists.hostId !== loggedInUser) {
  //   return res
  //     .status(StatusCodes.FORBIDDEN)
  //     .send(
  //       error("You do not have permission to edit this event", res.statusCode)
  //     );
  // }

  // make sure related post ID isn't the same as the post ID
  if (postId === req.body.relatedPostId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("Related post ID cannot be the same as the post ID", res.statusCode));
  }

  const updatedItem = await PostsService.updatePost(postId, req.body);
  if (!updatedItem) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("The item could not be updated. Please try again later", res.statusCode));
  }

  return res.send(
    success<PostDocument>(updatedItem, {
      statusCode: res.statusCode,
    })
  );
}
