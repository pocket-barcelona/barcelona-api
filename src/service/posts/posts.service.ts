import { PostDocument } from '../../models/post.model';
import { CreatePostInput } from "../../schema/post/post.schema";
import { getListHandler, getByIdHandler, createPostHandler } from "./functions";

export class PostsService {
  static getList = async () => getListHandler();
  static getById = async (
    postId: PostDocument["postId"]
  ) => getByIdHandler(postId);
  static createPost = async (input: CreatePostInput["body"]) =>
    createPostHandler(input);
}
