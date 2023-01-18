import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { ReadExploreInput } from '../../../schema/explore/explore.schema';
import { PriceBits, PriceEnum } from '../../../models/enums/price.enum';
import { TimeRecommendedBits } from '../../../models/enums/timerecommended.enum';
import { TimeOfDayBits } from '../../../models/enums/tod.enum';
import { CommitmentBits } from '../../../models/enums/commitment.enum';
import { ChildrenBits } from '../../../models/enums/children.enum';
import { TeenagerBits } from '../../../models/enums/teenager.enum';
import { RequiresBookingBits } from '../../../models/enums/requiresbooking.enum';

const DOCUMENT_SCAN_LIMIT = 1000;
const TEST_LIMIT = 10;

type FilterFields = 'active' | 'placeId' | 'provinceId' | 'barrioId' | 'categoryId' | 'price' | 'timeRecommended' | 'bestTod' | 'commitmentRequired' | 'price' | 'childrenSuitability' | 'teenagerSuitability' | 'popular' | 'annualOnly' | 'seasonal' | 'availableDaily' | 'availableSundays' | 'physicalLandmark' | 'requiresBooking' | 'metroZone' | 'hasImage' | 'placeTown' | 'daytrip';
type FilterFieldsType = keyof Pick<PlaceDocument, FilterFields>;

const fields: Record<FilterFieldsType, FilterFieldsType> = {
  active: 'active',
  annualOnly: 'annualOnly',
  availableDaily: 'availableDaily',
  availableSundays: 'availableSundays',
  barrioId: 'barrioId',
  bestTod: 'bestTod',
  categoryId: 'categoryId',
  childrenSuitability: 'childrenSuitability',
  commitmentRequired: 'commitmentRequired',
  daytrip: 'daytrip',
  hasImage: 'hasImage',
  metroZone: 'metroZone',
  physicalLandmark: 'physicalLandmark',
  placeId: 'placeId',
  placeTown: 'placeTown',
  popular: 'popular',
  price: 'price',
  provinceId: 'provinceId',
  requiresBooking: 'requiresBooking',
  seasonal: 'seasonal',
  teenagerSuitability: 'teenagerSuitability',
  timeRecommended: 'timeRecommended',
};


/**
 * Return a list of binary bits which are included ("on") in the input decimal number
 * @param weight 
 * @param binaryValues 
 * @returns 
 */
const getBitwiseValue = (weight: number | undefined, binaryValues: number[]): number[] => {
  const val = (weight ?? '').toString().length > 0 ? weight as number : null;
  if (val) {
    return binaryValues
    .filter(e => { 
      return (val & e) > 0;
    });
  }
  return [];
};

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
      // only fetch my events
      .where(fields.active)
      .eq(true);
      
    // apply filters here...
    if (body.provinceId?.length) {
      documents.and().where(fields.provinceId).in(body.provinceId)
    }
    if (body.barrioId?.length) {
      documents.and().where(fields.barrioId).in(body.barrioId)
    }
    if (body.categoryId?.length) {
      documents.and().where(fields.categoryId).in(body.categoryId)
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

    [
      { field: fields.price, value: priceIn },
      { field: fields.timeRecommended, value: timeRecommendedIn },
      { field: fields.bestTod, value: bestTodIn },
      { field: fields.commitmentRequired, value: commitmentRequiredIn },
      { field: fields.childrenSuitability, value: childrenSuitabilityIn },
      { field: fields.teenagerSuitability, value: teenagerSuitabilityIn },
      { field: fields.requiresBooking, value: requiresBookingIn },
    ].forEach(f => {
      if (f.value && f.value.length > 0) {
        documents.and().where(f.field).in(f.value);
      }
    });


    const metroZones = [1, 2, 3, 4, 5, 6];
    if (body.metroZone && metroZones.indexOf(body.metroZone) > -1) {
      documents.and().where(fields.metroZone).eq(body.metroZone)
    }

    if (body.popular === true || body.popular === false) {
      documents.and().where(fields.popular).eq(body.popular)
    }
    if (body.seasonal === true || body.seasonal === false) {
      documents.and().where(fields.seasonal).eq(body.seasonal)
    }
    if (body.availableSundays === true || body.availableSundays === false) {
      documents.and().where(fields.availableSundays).eq(body.availableSundays)
    }
    
    const daytripNumber = Number(body.daytrip);
    if (daytripNumber) {
      documents.and().where(fields.daytrip).eq(daytripNumber)
    }

    if (body.include && body.include.length > 0) {
      documents.or().where(fields.placeId).in(body.include)
    }
    
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
