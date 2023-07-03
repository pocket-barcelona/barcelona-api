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
 * Get a list of blog posts - for CMS
 * Return all posts regardless of their status and published date
 * @returns
 */
export default async function (): Promise<ScanResponse<PostDocument> | null> {
  try {
    const query = PostModel.scan();
    
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
