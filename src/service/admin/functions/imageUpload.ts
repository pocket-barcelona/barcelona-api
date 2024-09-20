import { type Request, Response } from "express";
import { AdminService, type UploadedFile } from '../admin.service';

export interface MyType {
  file: UploadedFile | null;
  success: boolean;
  error: string | null;
}
/**
 * Upload an image to S3
 * @returns
 */
export default async function (req: Request<unknown>, res: unknown): Promise<MyType | any> {

  // try {
  //   const uploadedResp = await AdminService.handleFileUploads(req);
    
  //   return uploadedResp;
  // } catch (error) {
  //   if (error instanceof Error) {
  //     return {
  //       file: null,
  //       success: false,
  //       error: error.message,
  //     }
  //   }
  // }
  // // if file uploaded successfully, add the info the the post images array
  
  
}
