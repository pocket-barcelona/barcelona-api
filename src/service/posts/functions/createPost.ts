import { v4 as uuidv4 } from 'uuid';
import PostModel, {
	type PostDocument,
	type PostInput,
	PostStatusEnum,
	PostVisibilityEnum,
} from '../../../models/post.model.js';
import type { CreatePostInput } from '../../../schema/post/post.schema.js';
import logger from '../../../utils/logger.js';
import { createTinyUuid } from '../../../utils/tiny.uuid.js';

/**
 * Create a new blog post
 * @returns The new post, or null
 */
export default async function (input: CreatePostInput['body']): Promise<PostDocument | null> {
	const newDocument: PostInput = {
		...input,
		// postId: uuidv4(),
		postId: createTinyUuid(),
		// postImages: input.postImages || [],
		postImages: [], // images are added after post is created
	};

	try {
		const result = await PostModel.create(newDocument).catch((err) => {
			// logger.warn(err);
			// timer({ ...metricsLabels, success: "false" });
			// return a validation error if present
			if (err?.message) return err.message;
			return null;
		});

		return result;
	} catch (e) {
		return null;
	}
}
