import express from 'express';
import { PlacesController } from '../controller/places/places.controller.js';
import validateResource from '../middleware/validateResource.js';

// import requireUser from "../middleware/requireUser.js";

import { exploreSchema } from '../schema/explore/explore.schema.js';
import { readPlaceSchema } from '../schema/place/place.schema.js';

const router = express.Router();

// ########### PLACES ###########
router.post('/', [validateResource(exploreSchema)], PlacesController.getListHandler);

router.get('/search/prepopulate', [], PlacesController.searchPrepopulateHandler);

router.get('/:placeId', [validateResource(readPlaceSchema)], PlacesController.getByIdHandler);

router.get('/categories/list', [], PlacesController.getPlaceCategoriesHandler);

router.get(
	'/:placeId/related',
	[validateResource(readPlaceSchema)],
	PlacesController.getRelatedPlacesHandler
);

router.get('/lookup/list', [], PlacesController.getPlaceLookupHandler);

export default router;
