import PostModel, { type PostDocument, type PostInput } from '../../../models/post.model';
import type { UpdatePostInput } from '../../../schema/post/post.schema';

/**
 * Update a blog post
 * @param input
 * @returns The updated post
 */
export default async function updatePost(postId: PostInput["postId"], input: UpdatePostInput["body"]): Promise<PostDocument | null> {
  try {
    const payload: PostInput = {
      ...input,
      postId,
      postImages: input.postImages || [],
      // handle dates...
      // myDate: input.myDate ? new Date(input.myDate) : new Date(0),
    };
    return await PostModel.update(payload).catch((err) => {
      // logger.warn(err);
      return null;
    });
  } catch (error) {
    // logger.warn(error);
    return null;
  }
}
