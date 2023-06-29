import { Request, Response } from "express";
import { AdminService, UploadedFile } from '../admin.service';

/**
 * Upload an image to S3
 * @returns
 */
export default async function (req: Request<any>, res: any): Promise<UploadedFile> {

  const uploadedResp = await AdminService.parseFileUploads(req);
  // if file uploaded successfully, add the info the the post images array
  
  return uploadedResp;
}
