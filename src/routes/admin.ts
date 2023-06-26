import express, { Express, Request, Response } from "express";
import { PostsController } from "../controller/posts/posts.controller";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import { createPostSchema, updatePostSchema } from "../schema/post/post.schema";

const router = express.Router();

// ########### ADMIN ONLY CMS ROUTES ###########

/** Get all blog posts - regardless of published status */
router.get("/posts", [requireUser], PostsController.getListHandler);

/** Get blog post by ID - regardless of published status */
router.get("/posts/:postId", [], PostsController.getByIdHandler);

/** Create new blog post */
router.post(
  "/create",
  [
    requireUser,
    validateResource(createPostSchema),
  ],
  PostsController.createPostHandler
);

/** Update blog post by ID */
router.patch(
  "/:postId",
  [
    // requireUser,
    validateResource(updatePostSchema),
  ],
  PostsController.updatePostHandler
);



// TODO
// delete blog post?
// upload image to aws
// delete image from aws

export default router;
