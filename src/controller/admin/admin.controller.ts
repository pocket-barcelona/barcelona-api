import { Request, Response } from "express";
import { imageUpload } from './handlers';

export class AdminController {
  static imageUploadHandler = (req: Request, res: Response) => imageUpload(req, res);

}
