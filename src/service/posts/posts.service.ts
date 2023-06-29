import { PostDocument, PostInput } from '../../models/post.model';
import { CreatePostInput, UpdatePostInput } from "../../schema/post/post.schema";
import { getListHandler, getByIdHandler, createPostHandler, updatePostHandler } from "./functions";

export class PostsService {
  static getList = async () => getListHandler();
  static getById = async (
    postId: PostDocument["postId"]
  ) => getByIdHandler(postId);
  static createPost = async (input: CreatePostInput["body"]) =>
    createPostHandler(input);
  
  static updatePost = async (
    postId: PostInput["postId"],
    input: UpdatePostInput["body"]
  ): Promise<PostDocument | null> => updatePostHandler(postId, input);
}
