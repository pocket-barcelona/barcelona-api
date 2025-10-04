import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { error, success } from '../../../middleware/apiResponse.js';
import type { BuildPlanInput } from '../../../schema/planner/planner.schema.js';
import PlannerService from '../../../service/planner/planner.service.js';
import PoiService from '../../../service/poi/poi.service.js';

/**
 * Create a structured x-day plan
 * @param req
 * @param res
 * @returns
 */
export default async function createStructuredPlan(
	req: Request<unknown, unknown, BuildPlanInput['body']>,
	res: Response
) {
	const data = await PlannerService.createStructuredPlan(req.body).catch((error: unknown) => {
		console.log(error);
	});
	if (!data || data.itinerary.length === 0) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(
				error(
					"Sorry, we couldn't create a plan with those criteria. Please narrow down your search so we can include more results.",
					res.statusCode
				)
			);
	}

	// fetch POI's if required
	const { body: input } = req;
	const shouldIncludeFood = input.includeFoodSuggestions === true;
	const shouldIncludeDrink = input.includeDrinkSuggestions === true;
	const shouldIncludeClubs = input.includeNightclubSuggestions === true;
	if (shouldIncludeFood || shouldIncludeDrink || shouldIncludeClubs) {
		// const latLng = {
		// 	lat: relatedBarrio?.centre.lat ?? 41.387023, // plaza cat!
		// 	lng: relatedBarrio?.centre.lng ?? 2.170051,
		// };

		const place = data.itinerary[0].places[0];

		// @todo - use the helper: await helper.fetchFoodAndDrinkDocuments(theme, results); ?
		const poiData = await PoiService.getList({
			lat: place.lat,
			lng: place.lng,
			barrioId: [place.barrioId],
			tagId: ['restaurant'], // for now we don't need this as all POI's are restaurants - but in future might be needed
		}).catch((error: unknown) => {
			console.log(error);
		});

		if (poiData) {
			data.itinerary[0].pois = poiData;
		}
	}

	return res.send(success(data));
}
