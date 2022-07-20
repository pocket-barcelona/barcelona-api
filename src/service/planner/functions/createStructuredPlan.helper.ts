import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { themesTestData } from "../../../collections/themes/themesTestData";
import { PlaceDocument } from "../../../models/place.model";
import { StructuredPlanResponse } from "../../../models/plan.model";
import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
} from "../../../models/planThemes.model";

export class PlanHelper {
  getDayProfile(numberOfDays: number): StructuredPlanDayProfile {
    return themesTestData[0];
  }

  /** Choose a random item from an array */
  getRandomItemFromArray<T>(theArray: T[]): T {
    const randomArrayIndex = this.getRandomNumberFromTo(0, theArray.length - 1);
    return theArray[randomArrayIndex];
  }

  /**
   * Returns a random number between min (inclusive) and max (exclusive)
   * @url https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
   */
  getRandomNumberFromTo(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  buildPlanResponse(
    dayNumber: number,
    theme: StructuredPlanDayProfile,
    // results: ScanResponse<PlaceDocument>
    results: PlaceDocument[]
  ): StructuredPlanResponse {

    // get a distinct of categories for the places in these results
    const categoryIds: Array<PlaceDocument['categoryId']> = [];
    results.forEach(p => {
      if (categoryIds.indexOf(p.categoryId) === -1) {
        categoryIds.push(p.categoryId);
      }
    });

    
    const resp: StructuredPlanResponse = {
      // @todo - planTitle can be tokenized
      planTitle: typeof theme.name === 'string' ? theme.name : theme.name[0],
      planTheme: theme.theme,
      itinerary: [
        {
          dayNumber,
          action: "TODO - verb",
          places: results,
        },
      ],
      eventNotices: [],
      summary: {
        // TODO
        numberOfDays: 1,
        budget: 0,
        includesPlacesOutsideCity: false,
        easyWalking: true,
        
        categoriesIncluded: categoryIds,
        
        focusOnSameLocation: 1,
        timeOfDay: 1,
        visitCentralBarriosOnly: true,
        excludePlaceIds: [],
        visitingWithPets: true,
        visitingWithChildren: true,
        visitingWithTeenagers: true,
        includesFoodRecommendations: true,
        includesDrinkRecommendations: true,
        includesEventNotices: false,
      },
    };

    return resp;
  }
}
