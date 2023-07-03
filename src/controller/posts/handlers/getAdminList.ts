import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PostsService } from "../../../service/posts/posts.service";

/**
 * Get a list of posts - for CMS
 * @param req
 * @param res
 * @returns
 */
export default async function getAdminList(req: Request, res: Response) {
  
  const data = await PostsService.getAdminList();

  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  return res.send(success(data));
}
