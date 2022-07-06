import express, { Express, Request, Response } from "express";
import { PlacesController } from "../controller/places/places.controller";
// import requireUser from "../middleware/requireUser";
const router = express.Router()


// ########### PLACES ###########
router.get("/", [], PlacesController.getListHandler);

export default router;
