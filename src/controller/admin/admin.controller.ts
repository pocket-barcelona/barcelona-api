import { Request, Response } from "express";
import { imageUpload } from './handlers';

export class AdminController {
  static imageUploadHandler = (req: Request, res: Response, next: any) => imageUpload(req, res, next);

}
