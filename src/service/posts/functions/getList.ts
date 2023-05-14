import logger from "../../../utils/logger";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import PostModel, { PostDocument } from '../../../models/post.model';

const sortBlogPosts = (a: PostDocument, b: PostDocument) => {
  const aPub = new Date(a.published).getTime();
  const bPub = new Date(b.published).getTime();
  if (aPub < bPub) return -1;
  if (aPub > bPub) return 1;
  return 0;
};

/**
 * Get a list of blog posts
 * @returns
 */
export default async function (): Promise<ScanResponse<PostDocument> | null> {
  const statusField: keyof PostDocument = "status";
  const publishedField: keyof PostDocument = "published";
  try {
    const query = PostModel.scan();
    // .where(statusField).eq('active');
    // and().where(published).gt(nowTime);
    
    const res = query.exec(); // this will scan every record
    return await res
    .catch((err) => {
      // logger.warn(err)
      return null;
    }).then(data => {
      if (!data) return null;
      return data.sort(sortBlogPosts);
    });
  } catch (e) {
    return null;
  }
}
