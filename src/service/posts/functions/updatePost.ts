import PostModel, { PostDocument, PostInput } from '../../../models/post.model';
import { UpdatePostInput } from '../../../schema/post/post.schema';

/**
 * Update a blog post
 * @param input
 * @returns The updated post
 */
export default async function updatePost(eventId: PostInput["postId"], input: UpdatePostInput["body"]): Promise<PostDocument | null> {
  try {
    const payload: Partial<PostDocument> = {
      
      // id: eventId,
      // activityDescription: input.activityDescription,
      // dateDescription: input.dateDescription,
      // location: input.location,
      // notes: input.notes,
      // eventTimeFrom: input.eventTimeFrom ? new Date(input.eventTimeFrom) : new Date(0),
      // eventTimeTo: input.eventTimeTo ? new Date(input.eventTimeTo) : new Date(0),
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
