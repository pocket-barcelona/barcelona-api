import express, { Express, Request, Response } from "express";
import { PostsController } from "../controller/posts/posts.controller";

const router = express.Router();

// ########### EXPERT POSTS ROUTES ###########
/** Get all posts */
router.get("/", [], PostsController.getListHandler);

/** Get post by ID */
router.get("/:postId", [], PostsController.getByIdHandler);


export default router;
