import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import PostModel, { type PostDocument, PostStatusEnum } from '../../../models/post.model.js';

// import logger from '../../../utils/logger.js';

const sortBlogPosts = (a: PostDocument, b: PostDocument) => {
	const aPub = new Date(a.published).getTime();
	const bPub = new Date(b.published).getTime();
	if (aPub < bPub) return -1;
	if (aPub > bPub) return 1;
	return 0;
};
const filterBlogPosts = (post: PostDocument): boolean => {
	const nowTime = new Date();
	const postPublished = new Date(post.published.toString());
	if (postPublished.getTime() < nowTime.getTime()) return true;
	return false;
};

/**
 * Get a list of blog posts
 * @returns
 */
export default async function (): Promise<ScanResponse<PostDocument> | PostDocument[] | null> {
	const statusField: keyof PostDocument = 'status';
	const publishedField: keyof PostDocument = 'published';
	const nowTime = new Date();
	try {
		const query = PostModel.scan().where(statusField).eq(PostStatusEnum.Active);
		// .and()
		// .where(publishedField)
		// .lt(nowTime.getTime());

		const res = query.exec(); // this will scan every record
		return await res
			.catch((_err) => {
				// logger.warn(err)
				return null;
			})
			.then((data) => {
				if (!data) return null;
				return data.filter(filterBlogPosts).sort(sortBlogPosts);
			});
	} catch (_e) {
		return null;
	}
}
