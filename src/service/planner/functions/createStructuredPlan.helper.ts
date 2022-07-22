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

  // // https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
  // randomlySortArray<T[]>(theArray: T[]): T[] {
  //   const shuffleArray = array => {
  //     for (let i = array.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       const temp = array[i];
  //       array[i] = array[j];
  //       array[j] = temp;
  //     }
  //   }
  // }

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

    const numberOfPlaces = results.length

    
    const resp: StructuredPlanResponse = {
      // @todo - planTitle can be tokenized
      planTitle: typeof theme.name === 'string' ? theme.name : theme.name[0],
      planTheme: theme.theme,
      itinerary: [
        {
          dayNumber,
          action: (theme.verbs && theme.verbs.length > 0) ? theme.verbs[0] : 'Go to',
          places: results,
        },
      ],
      eventNotices: [],
      summary: {
        // TODO
        numberOfDays: 1,
        numberOfPlaces: numberOfPlaces,
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
