import { PostDocument, PostInput } from '../../models/post.model';
import { CreatePostInput, UpdatePostInput } from "../../schema/post/post.schema";
import { getListHandler, getByIdHandler, createPostHandler, updatePostHandler, getAdminListHandler, getAdminByIdHandler } from "./functions";

export class PostsService {
  static getList = async () => getListHandler();
  static getAdminList = async () => getAdminListHandler();
  
  static getById = async (
    postId: PostDocument["postId"]
  ) => getByIdHandler(postId);

  static getAdminById = async (
    postId: PostDocument["postId"]
  ) => getAdminByIdHandler(postId);

  static createPost = async (input: CreatePostInput["body"]) =>
    createPostHandler(input);
  
  static updatePost = async (
    postId: PostInput["postId"],
    input: UpdatePostInput["body"]
  ): Promise<PostDocument | null> => updatePostHandler(postId, input);
}
