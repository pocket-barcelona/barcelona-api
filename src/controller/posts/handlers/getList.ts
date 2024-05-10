import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PostsService } from "../../../service/posts/posts.service";

/**
 * Get a list of posts
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request, res: Response) {
  
  const data = await PostsService.getList();
  
  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  // the listing endpoint doesn't need the post content and a lot of fields, so we can trim-down the payload
  const partialPostData = data.map((post) => {
    // const { content, ...rest } = post;
    // return rest;
    const { categoryId, postId,postImages, postTypeId, published, subtitle, summary, title, urlSlug } = post;
    return {
      categoryId, postId,postImages, postTypeId, published, subtitle, summary, title, urlSlug
    }
  });
  return res.send(success(partialPostData));
}
