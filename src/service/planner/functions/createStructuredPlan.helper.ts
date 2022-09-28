import { Condition } from "dynamoose";
import { Scan, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { themesTestData, WALKING_DISTANCES } from "../../../collections/themes/themesTestData";
import { TimeOfDayEnum } from "../../../models/enums/tod.enum";
import { PlaceDocument } from "../../../models/place.model";
import { StructuredPlanResponse } from "../../../models/plan.model";
import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
  ThemeInputSpecs,
} from "../../../models/planThemes.model";
import PoiModel, { PoiDocument } from "../../../models/poi.model";

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

  async fetchFoodAndDrinkDocuments(theme: StructuredPlanDayProfile, results: PlaceDocument[]): Promise<PoiDocument[]> {
    if (results.length <= 0) return Promise.resolve([]);

    const poiActiveField: keyof PoiDocument = 'active';
    const poiLatField: keyof PoiDocument = 'lat';
    const poiLngField: keyof PoiDocument = 'lng';

    const latLng = {
      lat: results[0].lat || -1,
      lng: results[0].lng || -1,
    };
    if (latLng.lat === -1 || latLng.lng === -1) return Promise.resolve([])
    
    let documents: Scan<PoiDocument>;
    let scanResults: ScanResponse<PoiDocument>;
    

    // match documents within a short walk away, just using lat/lng
    const diameter = WALKING_DISTANCES.medium;
    
    const lowerLat = latLng.lat - diameter;
    const upperLat = latLng.lat + diameter;
    const lowerLng = latLng.lng - diameter;
    const upperLng = latLng.lng + diameter;

    documents = PoiModel.scan().where(poiActiveField).eq(true);
    // do a query for food options
    // documents = PoiModel.scan({
    //   'lat': {
    //     'between': [lowerLat, upperLat]
    //     // 'gt': 2.1967216
    //   }
    // });

    

    // const f = new Condition({
    //   between([lowerLat, upperLat]),
    // });
    // documents = documents.and().parenthesis(
    //   new Condition().where(poiLatField).between(lowerLat, upperLat).or().where(poiLngField).between(lowerLng, upperLng)
    // );
    
    

    // @todo - doesn't work!?!?!?!?!
    // documents
    // .parenthesis({
    //   gt: (f),
    // })
    // .where(poiLatField)

    documents.and()
    .where(poiLatField).between(lowerLat, upperLat).and().where(poiLngField).between(lowerLng, upperLng);

    // get a list of places within walking distance from the lat/lng
    scanResults = await documents.limit(10).exec();
    return Promise.resolve(scanResults);
  }

  buildPlanResponse(
    dayNumber: number,
    theme: StructuredPlanDayProfile,
    // results: ScanResponse<PlaceDocument>
    results: PlaceDocument[],
    pois: PoiDocument[],
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

    // sum all the price enums and find an average
    const priceTotal = limitedResultSet.reduce((a, b) => {
      return a + (b.price ?? 0)
    }, 0);
    // average is sum over count of places
    const priceAverage = limitedResultSet.length > 0 ? priceTotal / limitedResultSet.length : 0;

    const allZone1 = limitedResultSet.every(i => i.metroZone === 1);
    const centralBarriosOnly = limitedResultSet.every(i => {
      // return true if 
      return [11, 12, 13].includes(i.barrioId);
    });
    // const centralBarriosOnly = centralBarriosOnlyCount.length === limitedResultSet.length;

    const planTitle = this.getPlanTitle(theme.name, limitedResultSet);

    const todDay = limitedResultSet.filter(i => i.bestTod === TimeOfDayEnum.Day);
    const todNight = limitedResultSet.filter(i => i.bestTod === TimeOfDayEnum.Night);
    const timeOfDay = todDay.length === limitedResultSet.length ? TimeOfDayEnum.Day : todNight.length === limitedResultSet.length ? TimeOfDayEnum.Night : TimeOfDayEnum.Both;
    const resp: StructuredPlanResponse = {
      // @todo - planTitle can be tokenized
      planTitle,
      planTheme: theme.theme,
      itinerary: [
        {
          dayNumber,
          action: (theme.verbs && theme.verbs.length > 0) ? theme.verbs[0] : 'Go to',
          places: limitedResultSet,
          pois: pois,
        },
      ],
      eventNotices: [],
      summary: {
        // numberOfDays: 1,
        numberOfPlaces: numberOfPlaces,
        priceAverage,
        includesPlacesOutsideCity: !allZone1,
        // TODO
        easyWalking: true,
        categoriesIncluded: categoryIds,
        // focusOnSameLocation: 1,
        timeOfDay,
        centralBarriosOnly,
        excludePlaceIds: theme.placeIdsExclude ?? [],

        // TODO
        visitingWithPets: true,
        visitingWithChildren: true,
        visitingWithTeenagers: true,
        includesFoodRecommendations: pois.length > 0,
        includesDrinkRecommendations: pois.length > 0, // todo
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

  private getHaversineDistance(lat1: number, lat2: number, lng1: number, lng2: number): number {

    // haversineSql = getHaversineDistance('pl.place_lat', ':lat_2', 'pl.place_lng', ':lng_2');
    // return "(
    //   6371 * acos(
    //       sin(radians(".lat1.")) * sin(radians(".lat2.")) + cos(radians(".lat1.")) * cos(radians(".lat2.")) * cos(radians(".lng2.") - radians(".lng1."))
    //   )
    // )";

    const degreesToRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180);
    };
    const radiansToDegrees = (radians: number): number => {
      return radians * (180 / Math.PI);
    };

    const diameterOfEarth = 6371;
    const radians = {
      lat1: degreesToRadians(lat1),
      lat2: degreesToRadians(lat2),
      lng1: degreesToRadians(lng1),
      lng2: degreesToRadians(lng2),
    };

    const calc = Math.acos(
      Math.sin(radians.lat1) * Math.sin(radians.lat2) + Math.cos(radians.lat1) * Math.cos(radians.lat2) * Math.cos(radians.lng2 - radians.lng1)
    );
    return diameterOfEarth * calc;
  }

  // getWalkingTime($walkingDist: number) {
  //   $walkingTimeBias = 1.15; // how much to multiply the walking time by to make it more realistic

  //   $walkingTime = (1000 * $walkingDist) / 60;
  //   $walkingTime = $walkingTime * $walkingTimeBias;
    
  //   switch (true) {
  //     case $walkingTime < 1:
  //       return 'Less than a minute';
  //     case $walkingTime <= 3:
  //       return 'A few minutes';
  //     case $walkingTime <= 10:
  //       return '5 - 10 minutes';
  //     case $walkingTime <= 15:
  //       return 'About 15 minutes';
  //     case $walkingTime <= 20:
  //       return 'About 20 minutes';
  //     case $walkingTime <= 35:
  //       return 'About half an hour';
  //     case $walkingTime <= 60:
  //       return 'Up to 1 hour';
  //     case $walkingTime <= 90:
  //       return 'Over 1 hour';
  //     default:
  //       return 'Over 2 hours';
  //   }
  // }

  getThemeInputParams = (theme: StructuredPlanDayProfile): ThemeInputSpecs => {
    const hasProvinceId = Number.isInteger(theme.provinceId);
    const hasBarrioIds = theme.barrioIds ? theme.barrioIds.length > 0 : false;
    const hasBarrioIdsChooseAmount = theme.barrioIdsChooseAmount !== undefined && Number.isInteger(theme.barrioIdsChooseAmount) && theme.barrioIdsChooseAmount > 0;
    const hasPlaceIds = theme.placeIds ? theme.placeIds.length > 0 : false;
    const hasExcludePlaceIds = theme.placeIdsExclude ? theme.placeIdsExclude.length > 0 : false;
    
    const hasPlaceIdsOrdered = theme.placeIdsAreOrdered === true;
    const hasPlaceIdsChooseAmount = theme.placeIdsChooseAmount !== undefined && Number.isInteger(theme.placeIdsChooseAmount) && theme.placeIdsChooseAmount > 0;
    const hasCategoryIds = theme.categoryIds ? theme.categoryIds.length > 0 : false;
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
    const hasPhysicalLandmark = theme.physicalLandmark === true || theme.physicalLandmark === false;
    return {
      hasProvinceId,
      hasBarrioIds,
      hasBarrioIdsChooseAmount,
      hasPlaceIds,
      hasExcludePlaceIds,
      hasPlaceIdsOrdered,
      hasPlaceIdsChooseAmount,
      hasCategoryIds,
      hasCategoryIdsChooseAmount,
      hasMetroZones,
      hasSeasonal,
      hasDaytrip,
      hasPopular,
      hasAnnualOnly,
      hasFreeToVisit,
      hasKeyword,
      hasStart,
      hasEnd,
      hasCenter,
      hasRadius,
      hasTimeRecommendedOptions,
      hasRequiresBookingOptions,
      hasFoodCategories,
      hasDrinkCategories,
      hasPhysicalLandmark,
    }
  }

  fields = () => {
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
    return {
      activeField,
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
    }

  }
}
