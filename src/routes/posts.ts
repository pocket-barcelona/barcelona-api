import express, { Express, Request, Response } from "express";
import { PostsController } from "../controller/posts/posts.controller";
import validateResource from "../middleware/validateResource";
import { filterByPoiSchema } from "../schema/poi/poi.schema";
import requireUser from "../middleware/requireUser";
import { createPostSchema, updatePostSchema } from "../schema/post/post.schema";

const router = express.Router();

// ########### EXPERT POSTS ROUTES ###########
/** Get all posts */
router.get("/", [], PostsController.getListHandler);

/** Get post by ID */
router.get("/:postId", [], PostsController.getByIdHandler);

/** Create new post */
router.post(
  "/create",
  [
    // requireUser,
    validateResource(createPostSchema),
  ],
  PostsController.createPostHandler
);

/** Update post by ID */
router.patch(
  "/:postId",
  [
    // requireUser,
    validateResource(updatePostSchema),
  ],
  PostsController.updatePostHandler
);

export default router;
