import express from 'express';
import { PoiController } from '../controller/poi/poi.controller.js';
import validateResource from '../middleware/validateResource.js';
import { filterByPoiSchema } from '../schema/poi/poi.schema.js';

const router = express.Router();

// ########### POINTS OF INTEREST ###########
router.post(
	'/',
	[
		// validateResource(filterByPoiSchema)
	],
	PoiController.getListHandler
);

export default router;
