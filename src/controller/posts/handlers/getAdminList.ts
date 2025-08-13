import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import { PostsService } from '../../../service/posts/posts.service.js';

/**
 * Get a list of posts - for CMS
 * @param req
 * @param res
 * @returns
 */
export default async function getAdminList(_req: Request, res: Response) {
	const data = await PostsService.getAdminList();

	if (!data) {
		return res.status(StatusCodes.NOT_FOUND).send(error('Error getting list', res.statusCode));
	}

	// the listing endpoint doesn't need the post content, so we can trim-down the payload
	const withoutPostContent = data.map((post) => {
		const { content, ...rest } = post;
		return rest;
	});
	return res.send(success(withoutPostContent));
}
