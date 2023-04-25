import { PlaceDocument } from '../../models/place.model';

type FilterFields = 'active' | 'placeId' | 'provinceId' | 'barrioId' | 'categoryId' | 'price' | 'timeRecommended' | 'bestTod' | 'commitmentRequired' | 'price' | 'childrenSuitability' | 'teenagerSuitability' | 'popular' | 'annualOnly' | 'seasonal' | 'availableDaily' | 'availableSundays' | 'physicalLandmark' | 'requiresBooking' | 'metroZone' | 'hasImage' | 'placeTown' | 'daytrip' | 'tags';
type FilterFieldsType = keyof Pick<PlaceDocument, FilterFields>;

export const PLACE_FILTER_FIELDS: Record<FilterFieldsType, FilterFieldsType> = {
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
  tags: 'tags',
};


/**
 * Return a list of binary bits which are included ("on") in the input decimal number
 * @param weight 
 * @param binaryValues 
 * @returns 
 */
export const getBitwiseValue = (weight: number | undefined, binaryValues: number[]): number[] => {
  const val = (weight ?? '').toString().length > 0 ? weight as number : null;
  if (val) {
    return binaryValues
    .filter(e => { 
      return (val & e) > 0;
    });
  }
  return [];
};
