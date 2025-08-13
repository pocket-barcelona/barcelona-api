import PostModel, { type PostDocument } from '../../../models/post.model.js';

/**
 * Get a specific blog post
 * @returns
 */
export default async function (postId: PostDocument['postId']): Promise<PostDocument | null> {
	try {
		const result = PostModel.get(postId);

		return await result.catch((err) => {
			// logger.warn(err)
			return null;
		});
	} catch (e) {
		return null;
	}
}
