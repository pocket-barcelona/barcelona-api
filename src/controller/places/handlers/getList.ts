import type { Request, Response } from "express";
import { error, success } from "../../../middleware/apiResponse";
import { StatusCodes } from "http-status-codes";
import { PlacesService } from "../../../service/places/places.service";
import type { ReadExploreInput } from '../../../schema/explore/explore.schema';
import { getDistance } from 'geolib';
import type { PlaceDocument, PlaceInput } from '../../../models/place.model';

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
export default async function getList(req: Request<unknown, unknown, unknown, ReadExploreInput['body']>, res: Response) {
  
  let records = await PlacesService.getList(req.body) as PlaceDocument[];
  
  if (!records) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(error("Error getting list", res.statusCode));
  }

  // support for filter by tags
  if (req.body.tags && req.body.tags.length > 0) {
    // @todo - support for more than 1 tag?
    const tag = (req.body.tags[0] ?? '').toString().toLowerCase();
    records = records.filter(d => {
      if (!d.tags) return false;
      const tagsList = d.tags.split(',').filter(t => t);
      if (!tagsList.includes(tag)) return false;
      return true;
    });
  }

  // augment data with extra info
  let mappedRecords = PlacesService.getMappedPlaceDocuments(records);

  // do ordering here...
  if (req.body?.poi) {
    // if there is a POI then order by distance closest
    const fromPairs = (req.body.poi as string).trim().split(',');
    if (fromPairs.length === 2) {
      const lat = Number.parseFloat(fromPairs[0]);
      const lng = Number.parseFloat(fromPairs[1]);
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

  if (req.body?.page && req.body.page > 1) {
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
