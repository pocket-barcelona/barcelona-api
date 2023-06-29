import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { AdminService } from '../../../service/admin/admin.service';
import { error, success } from '../../../middleware/apiResponse';
import FormData from "form-data";

export default async function (req: Request<any>, res: Response) {
  
  try {
    const data = await AdminService.handleFileUploads(req);
    if (false === data) {
      return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .send(error("Error uploading file, please try again", res.statusCode));
    }

    // if file uploaded, update post
    // const updatedPost = await PostService.updatePost(req.params.id, req.body);
    

    return res.send(
      success(data)
    );

  } catch (err: any) {
    if (err && err.message) {
      return res
      .status(StatusCodes.BAD_REQUEST)
      .send(error(err.message, res.statusCode));
    } else {
      return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error uploading file", res.statusCode));
    }
  }
}
