import { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import { ReadExploreInput } from '../../../schema/explore/explore.schema';
import { getDistance } from 'geolib';
import { PlaceInput } from '../../../models/place.model';

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

type LatLng = {
  lat: number;
  lng: number;
}

/**
 * Return a list of records ordered by distance closest to the `from`
 * @param from 
 * @param records 
 */
function orderByDistanceClosest(from: LatLng, records: PlaceInput[]) {
  const newRecords = records.map((place) => {
    const to: LatLng = {
      lat: place.lat,
      lng: place.lng,
    };
    const distance = getDistance(from, to);
    return {
      ...place,
      distance,
    }
  });

  newRecords.sort((fromPlace, toPlace) => {
    if (fromPlace.distance < toPlace.distance) {
      return -1;
    }
    if (fromPlace.distance > toPlace.distance) {
      return 1;
    }
    return 0;
  });

  return newRecords;
}

/**
 * Get a list of places, filtered by url params
 * @param req
 * @param res
 * @returns
 */
export default async function getList(req: Request<any, any, any, ReadExploreInput['body']>, res: Response) {
  
  const records = await PlacesService.getList(req.body);
  
  if (!records) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(error("Error getting list", res.statusCode));
  }

  let mappedRecords = PlacesService.getMappedPlaceDocuments(records);

  // do ordering here...
  if (req.body && req.body.poi) {
    // if there is a POI then order by distance closest
    const fromPairs = (req.body.poi as string).trim().split(',');
    if (fromPairs.length === 2) {
      const lat = parseFloat(fromPairs[0]);
      const lng = parseFloat(fromPairs[1]);
      mappedRecords = orderByDistanceClosest({ lat, lng }, mappedRecords);
    }
  }

  // PAGINATION
  // the user defined size of pagination per page - e.g. 25, 50
  const pageSize = Number(req.body.pageSize);
  // the actual paging size according to backend logic. Set as default
  let perPage = DEFAULT_PER_PAGE;
  // make sure user page size is within bounds
  if (pageSize > 0 && pageSize < MAX_PER_PAGE) {
    perPage = pageSize;
  }

  let sliceEnd = perPage;
  let page = 1;
  let sliceStart = 0;

  if (req.body && req.body.page && req.body.page > 1) {
    page = Number(req.body.page);
    // @todo - make sure the page number is within range, or break early?
  }

  if (page > 1) {
    // zero indexed
    sliceStart = (page - 1) * perPage;
    // zero indexed
    sliceEnd = sliceStart + perPage;
  }
  const subset = mappedRecords.slice(sliceStart, sliceEnd);
  // console.log({page})
  return res.send(success(
    // @todo - pagination
    subset,
    {
      meta: {
        totalRecords: mappedRecords.length,
        count: subset.length,
        page,
        pageSize: perPage,
      }
    }
  ));
}
