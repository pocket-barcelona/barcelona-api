import express, { Express, Request, Response } from "express";
import { PoiController } from "../controller/poi/poi.controller";
import validateResource from "../middleware/validateResource";
// import { readPlaceSchema } from "../schema/place/place.schema";

const router = express.Router()


// ########### POINTS OF INTEREST ###########
router.post("/poi", [], PoiController.getPoiHandler);


export default router;
