import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlanBuilderInput, StructuredPlanResponse } from "../../../models/plan.model";
import { PlanHelper } from "./createStructuredPlan.helper";
import { PlanThemeEnum, StructuredPlanDayProfile } from "../../../models/planThemes.model";
import { themesTestData } from "../../../collections/themes/themesTestData";
import { PoiDocument } from "../../../models/poi.model";
import { TEST_RESPONSE_PLAN_1 } from "../../../input/plan.input";

const DOCUMENT_SCAN_LIMIT = 500;



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
  let documents: Scan<PlaceDocument>;
  let results: ScanResponse<PlaceDocument>;
  const helper = new PlanHelper();
  const { activeField,
    provinceIdField,
    placeIdField,
    barrioIdField,
    categoryIdField,
    timeRecommendedField,
    bestTodField,
    commitmentRequiredField,
    priceField,
    freeToVisitField,
    childrenSuitabilityField,
    teenagerSuitabilityField,
    popularField,
    annualOnlyField,
    seasonalField,
    daytripField,
    availableDailyField,
    availableSundaysField,
    physicalLandmarkField,
    requiresBookingField,
    metroZoneField,
    latField,
    lngField,
  } = helper.fields();

  const theme: StructuredPlanDayProfile = {
    id: 0,
    name: 'Custom Itinerary',
    theme: PlanThemeEnum.Custom,
    verbs: ['Go to'],
  };

  try {
    
    documents = PlaceModel.scan().where(activeField).eq(true);

    // documents.and()
    // .where(categoryIdField).in(categoryIdsSubset);
    
    // // decide how to query
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

    
    // if (hasMetroZones) {
    //   documents
    //   .and().where(metroZoneField).in([theme.metroZone]);
    // }
    // if (hasSeasonal) {
    //   documents
    //   .and().where(seasonalField).eq(theme.seasonal);
    // }
    // if (hasDaytrip) {
    //   documents
    //   .and().where(daytripField).eq(theme.daytrip);
    // }
    // if (hasPopular) {
    //   documents
    //   .and().where(popularField).eq(theme.popular);
    // }
    // if (hasAnnualOnly) {
    //   documents
    //   .and().where(annualOnlyField).eq(theme.annualOnly);
    // }
    // if (Number.isInteger(hasFreeToVisit)) {
    //   documents
    //   .and().where(freeToVisitField).eq(theme.freeToVisit);
    // }

    // keyword
    // start
    // end
    // center, radius
    // if (hasTimeRecommendedOptions) {
    //   documents
    //   .and().where(timeRecommendedField).in(theme.timeRecommendedOptions);
    // }
    // if (hasRequiresBookingOptions) {
    //   documents
    //   .and().where(requiresBookingField).in(theme.requiresBookingOptions);
    // }

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
    // if (hasFoodCategories) {
    //   foodDrinkResults = await helper.fetchFoodAndDrinkDocuments(theme, results.toJSON() as PlaceDocument[]);
    // }

    const dayNumber = 1;
    const thePlan = helper.buildPlanResponse(dayNumber, theme, results.toJSON() as PlaceDocument[], foodDrinkResults);
    return thePlan;
    

    // console.log('Default response');
    // return TEST_RESPONSE_PLAN_1;
    
  } catch (e) {
    return null;
  }
}
