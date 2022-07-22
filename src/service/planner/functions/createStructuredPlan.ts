import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlanBuilderInput, StructuredPlanResponse, structuredPlanObj } from "../../../models/plan.model";
import { PlanHelper } from "./createStructuredPlan.helper";
import { PlanThemeEnum } from "../../../models/planThemes.model";
import { themesTestData } from "../../../collections/themes/themesTestData";

const DOCUMENT_SCAN_LIMIT = 500;
const DOCUMENT_LIST_RETURN_LIMIT = 25;

const activeField: keyof PlaceDocument = 'active';
const placeIdField: keyof PlaceDocument = 'placeId';
const barrioIdField: keyof PlaceDocument = 'barrioId';
const categoryIdField: keyof PlaceDocument = 'categoryId';
const timeRecommendedField: keyof PlaceDocument = 'timeRecommended';
const bestTodField: keyof PlaceDocument = 'bestTod';
const commitmentRequiredField: keyof PlaceDocument = 'commitmentRequired';
const priceField: keyof PlaceDocument = 'price';
const freeToVisitField: keyof PlaceDocument = 'freeToVisit';
const childrenSuitabilityField: keyof PlaceDocument = 'childrenSuitability';
const teenagerSuitabilityField: keyof PlaceDocument = 'teenagerSuitability';
const popularField: keyof PlaceDocument = 'popular';
const annualOnlyField: keyof PlaceDocument = 'annualOnly';
const seasonalField: keyof PlaceDocument = 'seasonal';
const daytripField: keyof PlaceDocument = 'daytrip';
const availableDailyField: keyof PlaceDocument = 'availableDaily';
const availableSundaysField: keyof PlaceDocument = 'availableSundays';
const physicalLandmarkField: keyof PlaceDocument = 'physicalLandmark';
const requiresBookingField: keyof PlaceDocument = 'requiresBooking';
const metroZoneField: keyof PlaceDocument = 'metroZone';
const latField: keyof PlaceDocument = 'lat';
const lngField: keyof PlaceDocument = 'lng';

/**
 * Generate a structured plan
 * // for each day, pick a theme at random. The same theme can occur again on another day, but is less likely
 * ignore themes which don't fit the input params
 * e.g. if includesPlacesOutsideCity=false, do not include day trips outside BCN

 * for each theme...build a day itinerary
 * ex. "Category based: Historical Buildings Tour"
 * get a list of places with category=buildings, barrioID=[array of IDs], order by random or popular
 * consider input prefs
 * - the budget - approx
 * - the time spent at each place - try to focus around user's choice. (choose places like 2-2-2-2-2-2) or 2-4-2-2-2 or 4-2-4-2 or 4-8 or 8-2-2 or 4-4-4 etc...
 * - time of day: make sure there is one place in the day and in the night, unless preference is set to day or night
 * - location - central barrios only?
 * - ignore place IDs in input
 * - check for pets, children, teenager settings
  
 * STEP 2 - include food and drinks
 * food can be, breakfast, brunch, coffee before, lunch, coffee after, drinks before, dinner, dessert, drinks after, cocktails, night club
 * @returns
 */
export default async function (input: PlanBuilderInput): Promise<StructuredPlanResponse | null> {
  try {
    const helper = new PlanHelper();
    // const randomTheme = helper.getRandomItemFromArray(planThemes);
    const themeId = input.themeId ?? 101;

    const theme = themesTestData.find(p => p.id === themeId);
    if (!theme) {
      throw new Error("Invalid theme ID");
    }
    const dayNumber = 1;

    
    // const dayProfile = 
    
    // put in helpers
    const hasBarrioIds = theme.barrioIds && theme.barrioIds.length > 0;
    const hasBarrioIdsChooseAmount = theme.barrioIdsChooseAmount !== undefined && Number.isInteger(theme.barrioIdsChooseAmount) && theme.barrioIdsChooseAmount > 0;
    const hasPlaceIds = theme.placeIds && theme.placeIds.length > 0;
    const hasExcludePlaceIds = theme.placeIdsExclude && theme.placeIdsExclude.length > 0;
    // placeIdsAlwaysInclude
    // placeIdsOptional
    const hasPlaceIdsOrdered = theme.placeIdsAreOrdered === true;
    // placeIdsChooseAmount
    const hasCategoryIds = theme.categoryIds && theme.categoryIds.length > 0;
    const hasCategoryIdsChooseAmount = theme.categoryIdsChooseAmount !== undefined && Number.isInteger(theme.categoryIdsChooseAmount) && theme.categoryIdsChooseAmount > 0;
    const hasMetroZones = theme.metroZone !== undefined;
    const hasSeasonal = theme.seasonal === true || theme.seasonal === false;
    const hasFreeToVisit = theme.freeToVisit !== undefined ? theme.freeToVisit : null;
    const hasKeyword = theme.keyword !== undefined && theme.keyword !== '';
    const hasRandomize = theme.randomize === true;
    const hasStart = theme.start !== undefined; // more checks?
    const hasEnd = theme.end !== undefined; // more checks?
    const hasCenter = theme.center !== undefined; // more checks?
    const hasRadius = theme.radius !== undefined && Number.isInteger(theme.radius) && theme.radius > 0;
    const hasTimeRecommendedOptions = Array.isArray(theme.timeRecommendedOptions) && theme.timeRecommendedOptions.length > 0; // more checks?
    const hasRequiresBookingOptions = Array.isArray(theme.requiresBookingOptions) && theme.requiresBookingOptions.length > 0; // more checks?
    const hasFoodCategories = Array.isArray(theme.foodCategories) && theme.foodCategories.length > 0; // more checks?
    const hasDrinkCategories = Array.isArray(theme.drinkCategories) && theme.drinkCategories.length > 0; // more checks?
    const hasLimit = theme.limit !== undefined && Number.isInteger(theme.limit) && theme.limit > 0;
    let documents: Scan<PlaceDocument>;
    let results: ScanResponse<PlaceDocument>;
    
    documents = PlaceModel.scan().where(activeField).eq(true)

    // decide how to query the places table
    switch (theme.theme) {

      case PlanThemeEnum.Category: {

        if (!hasCategoryIds) {
          throw new Error("categoryIds required");
        }
        
        // decide how to query
        documents.and()
        .where(categoryIdField).in(theme.categoryIds);

        if (hasBarrioIds && hasPlaceIds) {
          documents
          .and().where(barrioIdField).in(theme.barrioIds)
          .and().where(placeIdField).in(theme.placeIds);
        } else if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(theme.barrioIds);
        } else if (hasPlaceIds) {
          documents
          .and().where(placeIdField).in(theme.placeIds);
        }
        
        break;
      }
      case PlanThemeEnum.Location: {

        if (!hasBarrioIds) {
          throw new Error("barrioIds required");
        }
        
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(theme.barrioIds);
        }

        // .and().where(placeIdField).in(theme.placeIds);

        // do a query based on location using barrio IDs or lat/lng

        // decide how to query
        // documents.and()
        
        // .and()
        // .where(categoryIdField).in(theme.categoryIds);

        // if (hasBarrioIds && hasPlaceIds) {
        //   documents
        //   .and().where(barrioIdField).in(theme.barrioIds)
        //   .and().where(placeIdField).in(theme.placeIds);
        // } else if (hasBarrioIds) {
        //   documents
        //   .and().where(barrioIdField).in(theme.barrioIds);
        // } else if (hasPlaceIds) {
        //   documents
        //   .and().where(placeIdField).in(theme.placeIds);
        // }
        break;

      }
      case PlanThemeEnum.Trips: {

        if (hasPlaceIds) {
          documents.where(placeIdField).in(theme.placeIds);
        }
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(theme.barrioIds);
        }
        if (hasCategoryIds) {
          documents
          .and().where(categoryIdField).in(theme.categoryIds);
        }

        break;
      }
      case PlanThemeEnum.FoodAndDrink: {
        // handle all params in food and drink, but consider barrioIds and categoryIds
        break;
      }
      case PlanThemeEnum.NightsOut: {
        // handle all params in drink categories, but consider barrioIds and categoryIds
        break;
      }
      case PlanThemeEnum.BestOf: {
        // handle all params
        break;
      }

      case PlanThemeEnum.Route: {
        documents.and()
        .where(placeIdField).in(theme.placeIds)

        break;
      }
      default: {
        // unhandledParams = true;
        // break;
        return null
      }
    }

    // general param filters

    if (hasMetroZones) {
      documents
      .and().where(metroZoneField).in([theme.metroZone]);
    }

    if (hasSeasonal) {
      documents
      .and().where(seasonalField).eq(theme.seasonal);
    }

    if (Number.isInteger(hasFreeToVisit)) {
      documents
      .and().where(freeToVisitField).eq(theme.freeToVisit);
    }

    // if (hasExcludePlaceIds) {
    //   documents
    //   .and().where(placeIdField).in(theme.placeIdsExclude).not();
    // }


    // do a query by category and then process the results

    
    try {
      results = await documents.limit(DOCUMENT_SCAN_LIMIT).exec();
    } catch (error) {
      return null;
    }

    // process the list response.
    // consider randomize and limit
    const limitedResultSet = hasLimit ? results.toJSON().slice(0, 5) : results.toJSON().slice(0, DOCUMENT_LIST_RETURN_LIMIT);

    
    const thePlan = helper.buildPlanResponse(dayNumber, theme, limitedResultSet);
    if (thePlan) {
      return thePlan;
    }

    console.log('Default response');
    return structuredPlanObj;
    
  } catch (e) {
    return null;
  }
}
