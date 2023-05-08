import express, { Express, Request, Response } from "express";
import { PostsController } from "../controller/posts/posts.controller";
import validateResource from "../middleware/validateResource";
import { filterByPoiSchema } from "../schema/poi/poi.schema";

const router = express.Router()


// ########### EXPERT POSTS ROUTES ###########
router.get("/", [], PostsController.getListHandler);

router.get("/:postId", [], PostsController.getByIdHandler);

router.post("/create", [], PostsController.createPostHandler);

export default router;
