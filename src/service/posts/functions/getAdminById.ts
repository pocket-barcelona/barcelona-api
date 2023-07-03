import logger from "../../../utils/logger";
import PostModel, { PostDocument } from '../../../models/post.model';

/**
 * Get a specific blog post - regardless of status/published
 * @returns
 */
export default async function (
  postId: PostDocument['postId'],
): Promise<PostDocument | null> {
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
