import express from "express";
import { PoiController } from "../controller/poi/poi.controller";
import validateResource from "../middleware/validateResource";
import { filterByPoiSchema } from "../schema/poi/poi.schema";

const router = express.Router()


// ########### POINTS OF INTEREST ###########
router.post("/", [
    // validateResource(filterByPoiSchema)
], PoiController.getListHandler);


export default router;
