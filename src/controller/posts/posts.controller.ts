import type { Request, Response } from 'express';
import type { ReadPostInput, UpdatePostInput } from '../../schema/post/post.schema.js';
import {
	createPost,
	getAdminById,
	getAdminList,
	getById,
	getList,
	updatePost,
} from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class PostsController {
	static getListHandler = (req: Request, res: Response) => getList(req, res);

	static getAdminListHandler = (req: Request, res: Response) => getAdminList(req, res);

	static getByIdHandler = (req: Request<ReadPostInput['params']>, res: Response) =>
		getById(req, res);

	static getAdminByIdHandler = (req: Request<ReadPostInput['params']>, res: Response) =>
		getAdminById(req, res);

	static createPostHandler = (req: Request, res: Response) => createPost(req, res);

	static updatePostHandler = (
		req: Request<UpdatePostInput['params'], unknown, UpdatePostInput['body']>,
		res: Response
	) => updatePost(req, res);
}
