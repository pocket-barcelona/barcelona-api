import express, { Express, Request, Response } from "express";
import { GuideController } from "../controller/guide/guide.controller";
import validateResource from "../middleware/validateResource";
import { filterByPoiSchema } from "../schema/poi/poi.schema";

const router = express.Router()


// ########### EXPERT GUIDES ROUTES ###########
router.get("/", [], GuideController.getListHandler);

router.get("/:id", [], GuideController.getByIdHandler);

export default router;
