import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlanBuilderInput, StructuredPlanResponse, structuredPlanObj } from "../../../models/plan.model";
import { PlanHelper } from "./createStructuredPlan.helper";
import { PlanThemeEnum } from "../../../models/planThemes.model";
import { themesTestData } from "../../../collections/themes/themesTestData";
import { PoiDocument } from "../../../models/poi.model";

const DOCUMENT_SCAN_LIMIT = 500;


const activeField: keyof PlaceDocument = 'active';
const provinceIdField: keyof PlaceDocument = 'provinceId';
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
    const themeId = input.themeId;

    const theme = themesTestData.find(t => t.id === themeId);
    if (!theme) {
      throw new Error("Invalid theme ID");
    }
    const dayNumber = 1;

    
    // const dayProfile = 
    
    // put in helpers
    const hasProvinceId = Number.isInteger(theme.provinceId);
    const hasBarrioIds = theme.barrioIds && theme.barrioIds.length > 0;
    const hasBarrioIdsChooseAmount = theme.barrioIdsChooseAmount !== undefined && Number.isInteger(theme.barrioIdsChooseAmount) && theme.barrioIdsChooseAmount > 0;
    const hasPlaceIds = theme.placeIds && theme.placeIds.length > 0;
    const hasExcludePlaceIds = theme.placeIdsExclude && theme.placeIdsExclude.length > 0;
    // placeIdsAlwaysInclude
    // placeIdsOptional
    const hasPlaceIdsOrdered = theme.placeIdsAreOrdered === true;
    const hasPlaceIdsChooseAmount = theme.placeIdsChooseAmount !== undefined && Number.isInteger(theme.placeIdsChooseAmount) && theme.placeIdsChooseAmount > 0;
    const hasCategoryIds = theme.categoryIds && theme.categoryIds.length > 0;
    const hasCategoryIdsChooseAmount = theme.categoryIdsChooseAmount !== undefined && Number.isInteger(theme.categoryIdsChooseAmount) && theme.categoryIdsChooseAmount > 0;
    const hasMetroZones = theme.metroZone !== undefined;
    const hasSeasonal = theme.seasonal === true || theme.seasonal === false;
    const hasDaytrip = Number.isInteger(theme.daytrip);
    const hasPopular = theme.popular === true || theme.popular === false;
    const hasAnnualOnly = Number.isInteger(theme.annualOnly);
    const hasFreeToVisit = theme.freeToVisit !== undefined ? theme.freeToVisit : null;
    const hasKeyword = theme.keyword !== undefined && theme.keyword !== '';
    const hasStart = theme.start !== undefined; // more checks?
    const hasEnd = theme.end !== undefined; // more checks?
    const hasCenter = theme.center !== undefined; // more checks?
    const hasRadius = theme.radius !== undefined && Number.isInteger(theme.radius) && theme.radius > 0;
    const hasTimeRecommendedOptions = Array.isArray(theme.timeRecommendedOptions) && theme.timeRecommendedOptions.length > 0; // more checks?
    const hasRequiresBookingOptions = Array.isArray(theme.requiresBookingOptions) && theme.requiresBookingOptions.length > 0; // more checks?
    const hasFoodCategories = Array.isArray(theme.foodCategories) && theme.foodCategories.length > 0; // more checks?
    const hasDrinkCategories = Array.isArray(theme.drinkCategories) && theme.drinkCategories.length > 0; // more checks?
    
    let documents: Scan<PlaceDocument>;
    let results: ScanResponse<PlaceDocument>;
    
    documents = PlaceModel.scan().where(activeField).eq(true);

    const placeIdsSubset = 
      theme.placeIds && theme.placeIdsChooseAmount !== undefined && hasPlaceIds && hasPlaceIdsChooseAmount ?
      helper.getMultipleRandomItemsFromArray(theme.placeIds, theme.placeIdsChooseAmount) :
      theme.placeIds || [];
    
    const barrioIdsSubset = theme.barrioIds && theme.barrioIdsChooseAmount !== undefined && hasBarrioIds && hasBarrioIdsChooseAmount ?
      helper.getMultipleRandomItemsFromArray(theme.barrioIds, theme.barrioIdsChooseAmount) :
      theme.barrioIds || [];

    const categoryIdsSubset = theme.categoryIds && theme.categoryIdsChooseAmount !== undefined && hasCategoryIds && hasCategoryIdsChooseAmount ?
      helper.getMultipleRandomItemsFromArray(theme.categoryIds, theme.categoryIdsChooseAmount) :
      theme.categoryIds || [];
    
    // decide how to query the places table
    switch (theme.theme) {

      case PlanThemeEnum.Category: {

        if (!hasCategoryIds) {
          throw new Error("categoryIds required");
        }
        
        documents.and()
        .where(categoryIdField).in(categoryIdsSubset);
        
        // decide how to query
        if (hasBarrioIds && hasPlaceIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset)
          .and().where(placeIdField).in(placeIdsSubset);
        } else if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        } else if (hasPlaceIds) {
          documents
          .and().where(placeIdField).in(placeIdsSubset);
        }
        
        break;
      }
      case PlanThemeEnum.Location: {

        if (!hasBarrioIds) {
          throw new Error("barrioIds required");
        }
        
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        }

        // .and().where(placeIdField).in(placeIdsSubset);

        // do a query based on location using barrio IDs or lat/lng

        if (categoryIdsSubset.length) {
          documents.and()
          .where(categoryIdField).in(categoryIdsSubset);
        }

        // if (hasBarrioIds && hasPlaceIds) {
        //   documents
        //   .and().where(barrioIdField).in(barrioIdsSubset)
        //   .and().where(placeIdField).in(placeIdsSubset);
        // } else if (hasBarrioIds) {
        //   documents
        //   .and().where(barrioIdField).in(barrioIdsSubset);
        // } else if (hasPlaceIds) {
        //   documents
        //   .and().where(placeIdField).in(placeIdsSubset);
        // }
        break;
      }
      case PlanThemeEnum.Trips: {

        if (hasPlaceIds) {
          documents.where(placeIdField).in(placeIdsSubset);
        }
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        }
        if (hasCategoryIds) {
          documents
          .and().where(categoryIdField).in(categoryIdsSubset);
        }

        break;
      }
      case PlanThemeEnum.FoodAndDrink: {
        // handle all params in food and drink, but consider barrioIds and categoryIds
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        }
        if (hasCategoryIds) {
          documents
          .and().where(categoryIdField).in(categoryIdsSubset);
        }
        break;
      }
      case PlanThemeEnum.NightsOut: {
        // handle all params in drink categories, but consider barrioIds and categoryIds
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        }
        if (hasCategoryIds) {
          documents
          .and().where(categoryIdField).in(categoryIdsSubset);
        }
        break;
      }
      case PlanThemeEnum.BestOf: {
        // handle all params
        if (hasBarrioIds) {
          documents
          .and().where(barrioIdField).in(barrioIdsSubset);
        }
        if (hasCategoryIds) {
          documents
          .and().where(categoryIdField).in(categoryIdsSubset);
        }
        break;
      }

      case PlanThemeEnum.Route: {
        documents.and()
        .where(placeIdField).in(placeIdsSubset)

        break;
      }
      default: {
        // unhandledParams = true;
        // break;
        return null
      }
    }

    // general param filters
    if (hasProvinceId) {
      documents
      .and().where(provinceIdField).eq(theme.provinceId);
    }
    if (hasMetroZones) {
      documents
      .and().where(metroZoneField).in([theme.metroZone]);
    }
    if (hasSeasonal) {
      documents
      .and().where(seasonalField).eq(theme.seasonal);
    }
    if (hasDaytrip) {
      documents
      .and().where(daytripField).eq(theme.daytrip);
    }
    if (hasPopular) {
      documents
      .and().where(popularField).eq(theme.popular);
    }
    if (hasAnnualOnly) {
      documents
      .and().where(annualOnlyField).eq(theme.annualOnly);
    }
    if (Number.isInteger(hasFreeToVisit)) {
      documents
      .and().where(freeToVisitField).eq(theme.freeToVisit);
    }

    // keyword
    // start
    // end
    // center, radius
    if (hasTimeRecommendedOptions) {
      documents
      .and().where(timeRecommendedField).in(theme.timeRecommendedOptions);
    }
    if (hasRequiresBookingOptions) {
      documents
      .and().where(requiresBookingField).in(theme.requiresBookingOptions);
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

    let foodDrinkResults: PoiDocument[] = [];
    if (hasFoodCategories) {
      foodDrinkResults = await helper.fetchFoodAndDrinkDocuments(theme, results.toJSON() as PlaceDocument[]);
    }

    
    const thePlan = helper.buildPlanResponse(dayNumber, theme, results.toJSON() as PlaceDocument[], foodDrinkResults);
    if (thePlan) {
      return thePlan;
    }

    console.log('Default response');
    return structuredPlanObj;
    
  } catch (e) {
    return null;
  }
}
