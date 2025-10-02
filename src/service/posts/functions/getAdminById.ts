import PostModel, { type PostDocument } from '../../../models/post.model.js';
// import logger from '../../../utils/logger.js';

/**
 * Get a specific blog post - regardless of status/published
 * @returns
 */
export default async function (postId: PostDocument['postId']): Promise<PostDocument | null> {
	try {
		const result = PostModel.get(postId);

		return await result.catch((_error) => {
			// logger.warn(err)
			return null;
		});
	} catch (_error) {
		return null;
	}
}
