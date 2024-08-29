import type { Request, Response } from "express";
import { imageUpload } from './handlers';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AdminController {
  static imageUploadHandler = (req: Request, res: Response) => imageUpload(req, res);

}
