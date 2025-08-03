import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import type { ReadPostInput } from "../../../schema/post/post.schema";
import { PostsService } from "../../../service/posts/posts.service";

/**
 * Get a blog post by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(
	req: Request<ReadPostInput["params"]>,
	res: Response,
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
