import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { AdminService } from '../../../service/admin/admin.service';
import { error, success } from '../../../middleware/apiResponse';
import FormData from "form-data";
export default async function (req: Request<any>, res: Response) {
  
  
  // const data = await AdminService.uploadImage(req, res);
  const data = await AdminService.parseFileUploads(req);
  
  if (!data) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error uploading file", res.statusCode));
  } else if (data.error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error(data.error, res.statusCode));
  }

  return res.send(
    success(data)
  );
}
