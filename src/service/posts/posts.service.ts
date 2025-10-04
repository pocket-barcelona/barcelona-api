import type { PostDocument, PostInput } from '../../models/post.model.js';
import type { CreatePostInput, UpdatePostInput } from '../../schema/post/post.schema.js';
import {
	createPostHandler,
	getAdminByIdHandler,
	getAdminListHandler,
	getByIdHandler,
	getListHandler,
	updatePostHandler,
} from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: WIP
export class PostsService {
	static getList = async () => getListHandler();
	static getAdminList = async () => getAdminListHandler();

	static getById = async (postId: PostDocument['postId']) => getByIdHandler(postId);

	static getAdminById = async (postId: PostDocument['postId']) => getAdminByIdHandler(postId);

	static createPost = async (input: CreatePostInput['body']) => createPostHandler(input);

	static updatePost = async (
		postId: PostInput['postId'],
		input: UpdatePostInput['body']
	): Promise<PostDocument | null> => updatePostHandler(postId, input);
}
