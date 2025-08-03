import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import type { ReadPlaceInput } from "../../../schema/place/place.schema";
import { PlacesService } from "../../../service/places/places.service";

/**
 * Get a place by ID
 * @param req
 * @param res
 * @returns
 */
export default async function getById(
	req: Request<ReadPlaceInput["params"]>,
	res: Response,
) {
	if (!req.params.placeId) {
		return res
			.status(StatusCodes.BAD_REQUEST)
			.send(error("Please provide a place ID", res.statusCode));
	}

	const placeId = Number(req.params.placeId);
	const record = await PlacesService.getById(placeId);

	if (!record) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Error getting item", res.statusCode));
	}
	const mappedRecord = PlacesService.getMappedPlace(record);

	return res.send(success(mappedRecord));
}
