import { CreatePostInput } from "../../schema/post/post.schema";
import { getListHandler, getByIdHandler, createPostHandler } from "./functions";

export class PostsService {
  static getList = async () => getListHandler();
  static getById = async () => getByIdHandler();
  static createPost = async (input: CreatePostInput["body"]) =>
    createPostHandler(input);
}
