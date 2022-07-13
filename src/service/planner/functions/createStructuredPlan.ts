import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlanBuilderInput, StructuredPlan, structuredPlanObj } from "../../../models/plan.model";

/**
 * Generate a structured plan
 * @returns
 */
export default async function (input: PlanBuilderInput): Promise<StructuredPlan | null> {
  try {
    // const dayProfile = 
    // for each day, pick a theme at random. The same theme can occur again on another day, but is less likely
    // ignore themes which don't fit the input params
    // e.g. if includesPlacesOutsideCity=false, do not include day trips outside BCN

    // for each theme...build a day itinerary
    // ex. "Category based: Historical Buildings Tour"
    // get a list of places with category=buildings, barrioID=[array of IDs], order by random or popular
    // consider input prefs
    // - the budget - approx
    // - the time spent at each place - try to focus around user's choice. (choose places like 2-2-2-2-2-2) or 2-4-2-2-2 or 4-2-4-2 or 4-8 or 8-2-2 or 4-4-4 etc...
    // - time of day: make sure there is one place in the day and in the night, unless preference is set to day or night
    // - location - central barrios only?
    // - ignore place IDs in input
    // - check for pets, children, teenager settings
    
    // STEP 2 - include food and drinks
    // food can be, breakfast, brunch, coffee before, lunch, coffee after, drinks before, dinner, dessert, drinks after, cocktails, night club


    return structuredPlanObj;
    
  } catch (e) {
    return null;
  }
}
