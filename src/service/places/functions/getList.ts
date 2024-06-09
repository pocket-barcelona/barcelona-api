import PlaceModel, { type PlaceDocument } from "../../../models/place.model";
import { Query, type Scan, type ScanResponse } from "dynamoose/dist/DocumentRetriever";
import type { ReadExploreInput } from '../../../schema/explore/explore.schema';
import { PriceBits, PriceEnum } from '../../../models/enums/price.enum';
import { TimeRecommendedBits } from '../../../models/enums/timerecommended.enum';
import { TimeOfDayBits } from '../../../models/enums/tod.enum';
import { CommitmentBits } from '../../../models/enums/commitment.enum';
import { ChildrenBits } from '../../../models/enums/children.enum';
import { TeenagerBits } from '../../../models/enums/teenager.enum';
import { RequiresBookingBits } from '../../../models/enums/requiresbooking.enum';
import { PLACE_FILTER_FIELDS, getBitwiseValue } from '../utils';

const DOCUMENT_SCAN_LIMIT = 1000;

/**
 * Get a list of places with optional filters
 * @returns
 */
export default async function (
  body: ReadExploreInput['body'],
): Promise<ScanResponse<PlaceDocument> | null> {
  try {
    
    let documents: Scan<PlaceDocument>;

    documents = PlaceModel.scan()
      .where(PLACE_FILTER_FIELDS.active)
      .eq(true);
      
    // apply filters here...
    if (body.provinceId?.length) {
      documents.and().where(PLACE_FILTER_FIELDS.provinceId).in(body.provinceId)
    }
    if (body.barrioId?.length) {
      documents.and().where(PLACE_FILTER_FIELDS.barrioId).in(body.barrioId)
    }
    if (body.categoryId?.length) {
      documents.and().where(PLACE_FILTER_FIELDS.categoryId).in(body.categoryId)
    }
    // if (body.town && body.town.length > 0) {
    //   documents.and().where(fields.placeTown).in(body.placeTown)
    // }

    // bitwise filters
    const priceIn = getBitwiseValue(body.price, PriceBits);
    const timeRecommendedIn = getBitwiseValue(body.timeRecommended, TimeRecommendedBits);
    const bestTodIn = getBitwiseValue(body.bestTod, TimeOfDayBits);
    const commitmentRequiredIn = getBitwiseValue(body.commitmentRequired, CommitmentBits);
    const childrenSuitabilityIn = getBitwiseValue(body.childrenSuitability, ChildrenBits);
    const teenagerSuitabilityIn = getBitwiseValue(body.teenagerSuitability, TeenagerBits);
    const requiresBookingIn = getBitwiseValue(body.requiresBooking, RequiresBookingBits);

    // biome-ignore lint/complexity/noForEach: <explanation>
    [
      { field: PLACE_FILTER_FIELDS.price, value: priceIn },
      { field: PLACE_FILTER_FIELDS.timeRecommended, value: timeRecommendedIn },
      { field: PLACE_FILTER_FIELDS.bestTod, value: bestTodIn },
      { field: PLACE_FILTER_FIELDS.commitmentRequired, value: commitmentRequiredIn },
      { field: PLACE_FILTER_FIELDS.childrenSuitability, value: childrenSuitabilityIn },
      { field: PLACE_FILTER_FIELDS.teenagerSuitability, value: teenagerSuitabilityIn },
      { field: PLACE_FILTER_FIELDS.requiresBooking, value: requiresBookingIn },
    ].forEach(f => {
      if (f.value && f.value.length > 0) {
        documents.and().where(f.field).in(f.value);
      }
    });


    const metroZones = [1, 2, 3, 4, 5, 6];
    if (body.metroZone && metroZones.indexOf(body.metroZone) > -1) {
      documents.and().where(PLACE_FILTER_FIELDS.metroZone).eq(body.metroZone)
    }

    if (body.popular === true || body.popular === false) {
      documents.and().where(PLACE_FILTER_FIELDS.popular).eq(body.popular)
    }
    if (body.seasonal === true || body.seasonal === false) {
      documents.and().where(PLACE_FILTER_FIELDS.seasonal).eq(body.seasonal)
    }
    if (body.availableSundays === true || body.availableSundays === false) {
      documents.and().where(PLACE_FILTER_FIELDS.availableSundays).eq(body.availableSundays)
    }
    
    const daytripNumber = Number(body.daytrip);
    if (daytripNumber) {
      documents.and().where(PLACE_FILTER_FIELDS.daytrip).eq(daytripNumber)
    }

    if (body.include && body.include.length > 0) {
      documents.or().where(PLACE_FILTER_FIELDS.placeId).in(body.include)
    }

    // if (body.tags && body.tags.length > 0) {
    //   // @todo - support for more than 1 tag?
    //   const tag = (body.tags[0] ?? '').toString().toLowerCase();
    //   documents.and().where(PLACE_FILTER_FIELDS.tags).contains(`${tag},`).or().where(PLACE_FILTER_FIELDS.tags).contains(`,${tag}`);
    // }
    
    // todo...
    // if (body.exclude && body.exclude.length > 0) {
    //   documents.and().where(fields.placeId).in(body.exclude).not()
    // }
    
    
    // "poi": [],
    // "orderBy": "default"

    return await documents
    .limit(DOCUMENT_SCAN_LIMIT)
    .exec()
    .catch(() => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
