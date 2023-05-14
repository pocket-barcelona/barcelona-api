import logger from "../../../utils/logger";
import PostModel, { PostDocument, PostInput, PostStatusEnum, PostVisibilityEnum } from '../../../models/post.model';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostInput } from '../../../schema/post/post.schema';

/**
 * Create a new blog post
 * @returns The new post, or null
 */
export default async function (
  input: CreatePostInput["body"],
): Promise<PostDocument | null> {
  
  const newDocument: PostInput = {
    ...input,
    postId: uuidv4(),
    postImages: input.postImages || [],
  }

  try {

    const result = await PostModel.create(newDocument)
    .catch((err) => {
      // logger.warn(err);
      // timer({ ...metricsLabels, success: "false" });
      // return a validation error if present
      if (err && err.message) return err.message;
      return null;
    });

    return result;

  } catch (e) {
    return null;
  }

}
