import { Request, Response } from "express";
import { getList, getById, createPost, updatePost, getAdminList, getAdminById } from "./handlers";
import { ReadPostInput, UpdatePostInput } from "../../schema/post/post.schema";

export class PostsController {
  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getAdminListHandler = (req: Request, res: Response) => getAdminList(req, res);

  static getByIdHandler = (
    req: Request<ReadPostInput["params"]>,
    res: Response
  ) => getById(req, res);
  
  static getAdminByIdHandler = (
    req: Request<ReadPostInput["params"]>,
    res: Response
  ) => getAdminById(req, res);

  static createPostHandler = (req: Request, res: Response) =>
    createPost(req, res);

  static updatePostHandler = (
    req: Request<UpdatePostInput["params"], {}, UpdatePostInput["body"]>,
    res: Response
  ) => updatePost(req, res);
}
