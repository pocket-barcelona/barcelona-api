import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { error, success } from "../../../middleware/apiResponse";
import type { FilterByPoiInput } from "../../../schema/poi/poi.schema";
import { PoiService } from "../../../service/poi/poi.service";

/**
 * Get a list of points of interest
 * @param req
 * @param res
 * @returns
 */
export default async function getList(
	req: Request<FilterByPoiInput>,
	res: Response,
) {
	// accept some criteria for filtering
	// lat/lng
	// todo - work out what lat/lng distance equates to e.g. 100m in distance?

	const data = await PoiService.getList(req.query);

	if (!data) {
		return res
			.status(StatusCodes.NOT_FOUND)
			.send(error("Error getting list", res.statusCode));
	}

	return res.send(success(data));
}
