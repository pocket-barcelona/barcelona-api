import type BarrioModel from "./barrio.model";
import type CategoryModel from "./category.model";
import type PlaceModel from "./place.model";
import type { PlaceInput } from "./place.model";
import type { SetOptional } from 'type-fest';
import type { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import type { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import type { DrinkCategoryEnum, FoodCategoryEnum, FoodCuisinesEnum } from "./enums/foodcategory.enum";
import type { TimeOfDayEnum } from './enums/tod.enum';


// the keys from the place model
type PlaceKeys = 'annualOnly' | 'bestTod' | 'commitmentRequired' | 'childrenSuitability' |
'daytrip' | 'freeToVisit' | 'lat' | 'lng' | 'metroZone' | 'physicalLandmark' | 'placeId' |
'popular' | 'provinceId' | 'relatedPlaceId' | 'seasonal' |
'teenagerSuitability' | 'tags';

// the picked props from the place model
type PlaceAttributes = Pick<PlaceInput, PlaceKeys>;


export type StructuredPlanDayProfile = SetOptional<PlaceAttributes, PlaceKeys> & {
  /** The theme profile ID, so we can choose it specifically */
  id: number;
  /** The style/theme of the plan */
  theme: PlanThemeEnum;
  /** Plans should be based on day, night or both day and night */
  themeTod: TimeOfDayEnum;
  /** The name of the themed day profile */
  name: string | string[];
  /** @todo - Travelling mode for the itinerary. Use "VARIOUS" if multiple */
  mode?: 'BY_FOOT' | 'BY_CAR' | 'BY_BOAT' | 'VARIOUS';
  /** A list of actions to take, e.g. Take a walk around [Parc de la Ciutadella] */
  verbs?: string[];
  /** The number of places to limit to, for this day - if not included, other params will dictate the results */
  limit?: number;
  /** A key word to find in the tags */
  keyword?: string;
  /** A list of category IDs */
  categoryIds?: Array<typeof CategoryModel['categoryId']>;
  /** If given, this number of category IDs will be chosen from categoryIds array at random */
  categoryIdsChooseAmount?: number;
  /** A list of barrio IDs */
  barrioIds?: Array<typeof BarrioModel['barrioId']>;
  /** If given, this number of barrio IDs will be chosen from barrioIds array at random */
  barrioIdsChooseAmount?: number;
  /** A list of place IDs as a pool of IDs (in addition to e.g. categories, barrios etc...) */
  placeIds?: Array<typeof PlaceModel['placeId']>;
  /** A list of place IDs to exclude from the result set */
  placeIdsExclude?: Array<typeof PlaceModel['placeId']>;
  /** A list of place IDs to always include from the list of place IDs above */
  placeIdsAlwaysInclude?: Array<typeof PlaceModel['placeId']>;
  /** If you have the time, go here to? */
  placeIdsOptional?: Array<typeof PlaceModel['placeId']>;
  /** If true, the place IDs order is respected */
  placeIdsAreOrdered?: boolean;
  /** If given, this number of place IDs will be chosen from placeIds array at random */
  placeIdsChooseAmount?: number;
  /** A lat/lng point to begin at, or near to */
  start?: { lat: number; lng: number; };
  /** A lat/lng point to end at, or near to */
  end?: { lat: number; lng: number; };
  
  /** A lat/lng centre point - works with radius */
  center?: { lat: number; lng: number; };
  /** A radius from e.g. the centre point, in metres */
  radius?: number;

  timeRecommendedOptions?: TimeRecommendedEnum[];
  requiresBookingOptions?: RequiresBookingEnum[];

  foodCategories?: FoodCategoryEnum[];
  foodCuisines?: FoodCuisinesEnum[];
  drinkCategories?: DrinkCategoryEnum[];
  /** 1=only include places from Pocket Barcelona. 2=only include places from other people. 0=default (include all) */
  internal?: 0 | 1 | 2;
  /** Client-side ordering strategy for the result set */
  orderBy?: {
    /** Key must be in place model */
    key: PlaceKeys;
    direction: 'ASC' | 'DESC' | 'RANDOM';
    valueType?: 'BOOLEAN' | 'STRING' | 'NUMBER';
  }[];

  dateStart?: number;
  dateEnd?: number;
}

/**
 * The list of plans for a day. A day (could) be defined to be like this
 */
export type PlanThemes = 'location' | 'category' | 'trips' | 'bestof' | 'nightsout' | 'fooddrink' | 'route';
export enum PlanThemeEnum {
  Custom = 0,
  /** A filter by barrio IDs, then filtered by params */
  Location = 1,
  /** A filter by category IDs, then filtered by params */
  Category = 2,
  /** A trip to a specific place or place IDs (probably require a lof of time) */
  Trips = 3,
  /** A recommendation of best bars, rests, places, barrio Id */
  BestOf = 4,
  /** A selection of nights out recommendations */
  NightsOut = 5,
  /** A list of selected bars and restaurants, filtered by params */
  FoodAndDrink = 6,
  /** A list of specific place IDs in an order */
  Route = 7,
}

export interface ThemeInputSpecs {
  hasProvinceId: boolean;
  hasBarrioIds: boolean;
  hasBarrioIdsChooseAmount: boolean;
  hasPlaceIds: boolean;
  hasExcludePlaceIds: boolean;
  // placeIdsAlwaysInclude
  // placeIdsOptional
  hasPlaceIdsOrdered: boolean;
  hasPlaceIdsChooseAmount: boolean;
  hasCategoryIds: boolean;
  hasCategoryIdsChooseAmount: boolean;
  hasMetroZones: boolean;
  hasSeasonal: boolean;
  hasDaytrip: boolean;
  hasPopular: boolean;
  hasAnnualOnly: boolean;
  hasFreeToVisit: number | null;
  hasKeyword: boolean;
  hasStart: boolean;
  hasEnd: boolean;
  hasCenter: boolean;
  hasRadius: boolean;
  hasTimeRecommendedOptions: boolean;
  hasRequiresBookingOptions: boolean;
  hasFoodCategories: boolean;
  hasDrinkCategories: boolean;
  hasPhysicalLandmark: boolean;
}
