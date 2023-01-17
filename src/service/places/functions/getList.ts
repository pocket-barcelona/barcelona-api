import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { ReadExploreInput } from '../../../schema/explore/explore.schema';
import { PriceBits, PriceEnum } from '../../../models/enums/price.enum';
import { TimeRecommendedBits } from '../../../models/enums/timerecommended.enum';
import { TimeOfDayBits } from '../../../models/enums/tod.enum';
import { CommitmentBits } from '../../../models/enums/commitment.enum';

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

const DOCUMENT_SCAN_LIMIT = 500;
const TEST_LIMIT = 10;

type FilterFields = 'active' | 'provinceId' | 'barrioId' | 'categoryId' | 'price' | 'timeRecommended' | 'bestTod' | 'commitmentRequired' | 'price' | 'childrenSuitability' | 'teenagerSuitability' | 'popular' | 'annualOnly' | 'seasonal' | 'availableDaily' | 'availableSundays' | 'physicalLandmark' | 'requiresBooking' | 'metroZone' | 'hasImage' | 'placeTown';
type FilterFieldsType = keyof Pick<PlaceDocument, FilterFields>;
/**
 * Get a list of places with optional filters
 * @returns
 */
export default async function (
  body: ReadExploreInput['body'],
): Promise<ScanResponse<PlaceDocument> | null> {
  try {
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
      hasImage: 'hasImage',
      metroZone: 'metroZone',
      physicalLandmark: 'physicalLandmark',
      placeTown: 'placeTown',
      popular: 'popular',
      price: 'price',
      provinceId: 'provinceId',
      requiresBooking: 'requiresBooking',
      seasonal: 'seasonal',
      teenagerSuitability: 'teenagerSuitability',
      timeRecommended: 'timeRecommended',
    };
    
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

    if (priceIn.length > 0) {
      documents.and().where(fields.price).in(priceIn);
    }
    // const price = (body.price ?? '').toString().length > 0 ? body.price as number : null;
    // if (price) {
    //   const priceIn = PriceBits
    //   .filter(e => {
    //     return (price & e) > 0;
    //   })
    //   documents.and().where(fields.price).in(priceIn);
    // }

    // time recommended bitwise filter
    const timeRecommended = (body.timeRecommended ?? '').toString().length > 0 ? body.timeRecommended as number : null;
    if (timeRecommended) {
      const timeRecommendedIn = TimeRecommendedBits
      .filter(e => {
        return (timeRecommended & e) > 0;
      })
      documents.and().where(fields.timeRecommended).in(timeRecommendedIn);
    }

    // time recommended bitwise filter
    const bestTod = (body.bestTod ?? '').toString().length > 0 ? body.bestTod as number : null;
    if (bestTod) {
      const bestTodIn = TimeOfDayBits
      .filter(e => {
        return (bestTod & e) > 0;
      })
      documents.and().where(fields.bestTod).in(bestTodIn);
    }

    // commitment bitwise filter
    const commitmentRequired = (body.commitmentRequired ?? '').toString().length > 0 ? body.commitmentRequired as number : null;
    if (commitmentRequired) {
      const commitmentRequiredIn = CommitmentBits
      .filter(e => {
        return (commitmentRequired & e) > 0;
      })
      documents.and().where(fields.commitmentRequired).in(commitmentRequiredIn);
    }

    // todo...
    // "childrenSuitability": 1,
    // "teenagerSuitability": 1,
    // "requiresBooking": 1,
    // "metroZone": 1,
    // "popular": true,
    // "seasonal": false,
    // "availableSundays": true,
    // "exclude": [187, 98, 32],
    // "include": [132, 35, 70],
    // "poi": [],
    // "orderBy": "default"

    return await documents
    .limit(50)
    .exec()
    .catch(() => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
