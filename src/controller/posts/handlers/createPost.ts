import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { CreatePostInput } from '../../../schema/post/post.schema.js';
import { PostsService } from '../../../service/posts/posts.service.js';

/**
 * Create a new blog post
 * @param req
 * @param res
 * @returns
 */
export default async function createPost(
	req: Request<any, any, CreatePostInput['body']>,
	res: Response
) {
	const newItem = await PostsService.createPost(req.body);

	// send a useful data validation message
	if (typeof newItem === 'string') {
		return res.status(StatusCodes.BAD_REQUEST).send(error(newItem, res.statusCode));
	}

	if (newItem) {
		return res.send(success(newItem));
	}
	return res.status(StatusCodes.BAD_REQUEST).send(error('Invalid data', res.statusCode));
}
