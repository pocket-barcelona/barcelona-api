import { Request, Response } from "express";
import { getList, getById, createPost } from './handlers';

export class PostsController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);
  
  static getByIdHandler = (req: Request, res: Response) => getById(req, res);
  
  static createPostHandler = (req: Request, res: Response) => createPost(req, res);

}
