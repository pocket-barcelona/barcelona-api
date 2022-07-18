import BarrioModel from "./barrio.model";
import CategoryModel from "./category.model";
import PlaceModel, { PlaceInput } from "./place.model";
import type { SetOptional } from 'type-fest';
import { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import { DrinkCategoryEnum, FoodCategoryEnum } from "./enums/foodcategory.enum";


// the keys from the place model
type PlaceKeys = 'bestTod' | 'commitmentRequired' | 'childrenSuitability' |
'daytrip' | 'freeToVisit' | 'lat' | 'lng' | 'metroZone' | 'physicalLandmark' |
'popular' | 'provinceId' | 'relatedPlaceId' | 'seasonal' |
'teenagerSuitability' | 'tags';

// the picked props from the place model
type PlaceAttributes = Pick<PlaceInput, PlaceKeys>;

// set picked props to be optional
export type StructuredPlanDayProfile = SetOptional<PlaceAttributes, PlaceKeys> & {
  /** The theme profile ID, so we can choose it specifically */
  id: number;
  /** The style/theme of the plan */
  theme: PlanThemeEnum;
  /** The name of the themed day profile */
  name: string;
  /** The number of places to limit to, for this day - if not included, other params will dictate the results */
  limit?: number;
  /** If true, the final list will be randomized */
  randomize?: boolean;
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
  drinkCategories?: DrinkCategoryEnum[];
  /** 1=only include places from Pocket Barcelona. 2=only include places from other people. 0=default (include all) */
  internal?: 0 | 1 | 2;
  /** Client-side ordering strategy for the result set */
  orderBy?: {
    key: string;
    direction: 'ASC' | 'DESC' | 'RANDOM';
  }[];
}

/**
 * The list of plans for a day. A day (could) be defined to be like this
 */
export type PlanThemes = 'location' | 'category' | 'trips' | 'bestof' | 'nightsout' | 'fooddrink' | 'route';
export enum PlanThemeEnum {
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
