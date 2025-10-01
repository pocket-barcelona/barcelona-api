import type { Request, Response } from 'express';
import { imageUpload } from './handlers/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: WIP
export class AdminController {
	static imageUploadHandler = (req: Request, res: Response) => imageUpload(req, res);
}
