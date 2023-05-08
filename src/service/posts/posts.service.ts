import { getListHandler, getByIdHandler, createPostHandler } from "./functions";

export class PostsService {
  static getList = async () => getListHandler();
  static getById = async () => getByIdHandler();
  static createPost = async () => createPostHandler();
}
