import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { themesTestData } from "../../../collections/themes/themesTestData";
import { PlaceDocument } from "../../../models/place.model";
import { StructuredPlanResponse } from "../../../models/plan.model";
import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
} from "../../../models/planThemes.model";

const DOCUMENT_LIST_RETURN_LIMIT = 25;
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
  
  /**
   * Get n random items from an array
   * @link https://bobbyhadz.com/blog/javascript-get-multiple-random-elements-from-array#:~:text=To%20get%20multiple%20random%20elements,to%20get%20multiple%20random%20elements.
   * @param  {T[]} arr
   * @param  {number} num
   * @returns T
   */
  getMultipleRandomItemsFromArray<T>(arr: T[], num: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
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

    // sort list
    if (theme.orderBy && theme.orderBy.length > 0) {
      const sortKey = theme.orderBy[0].key;
      const valueType = theme.orderBy[0].valueType ?? 'NUMBER';
      const sortDirection = theme.orderBy[0].direction;
      
      // order results by array items
      // ...could be multiple sort levels @todo
      
      results = results.sort((a, b) => {
        // sort randomly!
        if (sortDirection === 'RANDOM') {
          return Math.random() > 0.5 ? 1 : -1;
        }

        const aVal = a[sortKey];
        const bVal = b[sortKey];
        switch (valueType) {
          case 'BOOLEAN': 
            return aVal === true && bVal === false ? 1 : (aVal === true && bVal === true ? 0 : -1);
          
          default:
            return aVal > bVal ? 1 : (aVal === bVal ? 0 : -1);
        }
      });
    }

    // @todo - consider randomize


    // truncate list
    const hasLimit = theme.limit !== undefined && Number.isInteger(theme.limit) && theme.limit > 0;
    const limitedResultSet = hasLimit ? results.slice(0, theme.limit) : results.slice(0, DOCUMENT_LIST_RETURN_LIMIT);

    // get distinct categories for the places in the results
    const categoryIds: Array<PlaceDocument['categoryId']> = [];
    limitedResultSet.forEach(p => {
      if (categoryIds.indexOf(p.categoryId) === -1) {
        categoryIds.push(p.categoryId);
      }
    });

    const numberOfPlaces = limitedResultSet.length;

    const planTitle = this.getPlanTitle(theme.name, limitedResultSet);
    
    const resp: StructuredPlanResponse = {
      // @todo - planTitle can be tokenized
      planTitle,
      planTheme: theme.theme,
      itinerary: [
        {
          dayNumber,
          action: (theme.verbs && theme.verbs.length > 0) ? theme.verbs[0] : 'Go to',
          places: limitedResultSet,
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
  
  /**
   * Convert "Daytrip to {place}" to "Daytrip to Montgat". Assumes "{" is not at the start of the name string
   * @param  {StructuredPlanDayProfile['name']} themeName
   * @param  {PlaceDocument[]} results
   * @returns string
   */
  getPlanTitle(themeName: StructuredPlanDayProfile['name'], results: PlaceDocument[]): string {
    const name = typeof themeName === 'string' ? themeName : themeName[0];
    if (name.indexOf('{') > -1 && name.indexOf('}') > -1) {

      // get the word between the curly braces
      const spl = name.split('}');
      const spl2 = spl[0].split('{');
      // const firstPart = spl2[0].toString().trim();
      const token = spl2[1] || '';

      const placeName = results[0].nameOfficial || '';
      const regex = new RegExp(`{${token.toString().trim()}}`, "g");
      const replaced = name.replace(regex, placeName);
      return replaced;
    }
    return name;
  }
}
