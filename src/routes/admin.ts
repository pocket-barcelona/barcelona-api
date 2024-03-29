import express, { Express, Request, Response } from "express";
import { PostsController } from "../controller/posts/posts.controller";
import validateResource from "../middleware/validateResource";
import requireUser from "../middleware/requireUser";
import { createPostSchema, updatePostSchema } from "../schema/post/post.schema";
import { AdminController } from '../controller/admin/admin.controller';

const router = express.Router();

// ########### ADMIN ONLY CMS ROUTES ###########

// TODO - apply requireUser to all admin routes
// router.all("/*", [requireUser])

/** Get all blog posts - regardless of published status */
router.get("/posts", [requireUser], PostsController.getAdminListHandler);

/** Get blog post by ID - regardless of published status */
router.get("/posts/:postId", [requireUser], PostsController.getAdminByIdHandler);

/** Create new blog post */
router.post(
  "/posts/create",
  [requireUser, validateResource(createPostSchema)],
  PostsController.createPostHandler
);

/** Update blog post by ID */
router.patch(
  "/posts/:postId",
  [requireUser, validateResource(updatePostSchema)],
  PostsController.updatePostHandler
);

router.post(
  "/posts/images/upload",
  [
    // requireUser,
    // validateResource(updatePostSchema),
  ],
  AdminController.imageUploadHandler
);


// TODO
// delete blog post?
// delete image from aws

export default router;
