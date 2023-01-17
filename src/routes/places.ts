import express, { Express, Request, Response } from "express";
import { PlacesController } from "../controller/places/places.controller";
import validateResource from "../middleware/validateResource";
// import requireUser from "../middleware/requireUser";

import { readPlaceSchema } from "../schema/place/place.schema";
import { exploreSchema } from '../schema/explore/explore.schema';

const router = express.Router()


// ########### PLACES ###########
router.get("/", [validateResource(exploreSchema)], PlacesController.getListHandler);

router.get("/:placeId", [validateResource(readPlaceSchema)], PlacesController.getByIdHandler);

router.get("/categories/list", [], PlacesController.getPlaceCategoriesHandler);

router.get("/:placeId/related", [validateResource(readPlaceSchema)], PlacesController.getRelatedPlacesHandler);


export default router;
