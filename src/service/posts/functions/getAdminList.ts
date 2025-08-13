import type { ScanResponse } from 'dynamoose/dist/ItemRetriever';
import PostModel, { type PostDocument } from '../../../models/post.model.js';
import logger from '../../../utils/logger.js';

const sortBlogPosts = (a: PostDocument, b: PostDocument) => {
	const aCreated = new Date(a.createdAt).getTime();
	const bCreated = new Date(b.createdAt).getTime();

	// const aPub = new Date(a.published).getTime();
	// const bPub = new Date(b.published).getTime();
	// if (aPub < bPub) return -1;
	// if (aPub > bPub) return 1;
	if (aCreated > bCreated) return -1;
	if (aCreated < bCreated) return 1;
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
			})
			.then((data) => {
				if (!data) return null;
				return data.sort(sortBlogPosts);
			});
	} catch (e) {
		return null;
	}
}
