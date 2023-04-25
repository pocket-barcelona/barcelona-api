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
import { PlacesService } from '../../places/places.service';
import { CENTRAL_BARRIO_IDS } from '../../../collections/themes/all/theme-category';

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

    // get a list of places within walking distance from the lat/lng
    documents.and()
    .where(poiLatField).between(lowerLat, upperLat).and().where(poiLngField).between(lowerLng, upperLng);

    try {
      scanResults = await documents.limit(10).exec();
      return Promise.resolve(scanResults);
      
    } catch (error) {
      console.log('Error', error);
      return Promise.resolve([]);
    }
  }

  buildPlanResponse(
    // dayNumber: number,
    theme: StructuredPlanDayProfile,
    // results: ScanResponse<PlaceDocument>
    results: PlaceDocument[],
    pois: PoiDocument[],
    numberOfDays: number,
    startEnd?: { from: number; to: number; } | undefined,
  ): StructuredPlanResponse {

    // augment place data
    results = results.map(r => PlacesService.getMappedPlace(r) as PlaceDocument);

    // sort list
    results = this.sortResultSubset(theme, results);

    // @todo - consider randomize


    // put places into "day buckets" by filling up the day according time recommended metric
    const itinerary = this.getDayByDayItinerary(theme, results, numberOfDays);

    // truncate list...
    // const hasLimit = theme.limit !== undefined && Number.isInteger(theme.limit) && theme.limit > 0;

    // let limitedResultSet: PlaceDocument[] = [];
    // if the result set has a set limit in the theme, slice it
    // if (hasLimit) {
      // limitedResultSet = results.slice(0, theme.limit);
    // } else {
    // }

    // // include enough places to do in 1 day, using the timeRecommended as a guide
    // // the maximum number of things to do in 1 day will be about 16 (let's say 16 items of an hour each, but some places will be close to each other)

    // let dayBucket = 0;
    // // let placeCounter = 0;
    // let placeIndex = 0;
    // const maxBucket = 12; // one day=8 but allow for extra
    
    // while (results.length > 0) {
    //   placeIndex = 0;
    //   // loop through the array until we fill a bucket
    //   // take note of the index
    //   results.every((p, idx) => {
    //     placeIndex = idx;
    //     dayBucket += p.timeRecommended;
    //     if (dayBucket > maxBucket) {
    //       // stop looping
    //       return false;
    //     }
    //     return true;
    //   });

    //   // const sliceAt = placeCounter > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeCounter;
    //   const sliceAt = placeIndex > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeIndex;
    //   limitedResultSet = results.splice(0, sliceAt);  
    // }


    // logically order the results on the map
    // limitedResultSet = this.orderResultsBasedOnLatLng(limitedResultSet);
    
    


    
    // // how many places are in the result set?
    // // const numberOfPlaces = limitedResultSet.length;
    // const numberOfPlaces = 1;

    // // sum all the price enums and find an average
    // const priceTotal = limitedResultSet.reduce((a, b) => {
    //   return a + (b.price ?? 0)
    // }, 0);

    // // average is sum over count of places
    // const priceAverage = limitedResultSet.length > 0 ? priceTotal / limitedResultSet.length : 0;
    
    // // check if all places in the subset are in zone 1
    // const allZone1 = limitedResultSet.every(i => i.metroZone === 1);

    // // check if all places are in the central neighbourhoods of gothic, raval and born
    // const centralBarriosOnly = limitedResultSet.every(i => {
    //   // return true if barrio is raval, gothic or born
    //   return [...CENTRAL_BARRIO_IDS].includes(i.barrioId);
    // });

    // // generate a plan title, like "Custom Itinerary"
    const planTitle = this.getPlanTitle(theme.name, itinerary[0].places ?? []);

    // // this is an array of places which are best visited during the day only
    // const todDay = limitedResultSet.filter(i => i.bestTod === TimeOfDayEnum.Day);
    // const todNight = limitedResultSet.filter(i => i.bestTod === TimeOfDayEnum.Night);// this is an array of places which are best visited during the night only
    // const timeOfDay = todDay.length === limitedResultSet.length ? TimeOfDayEnum.Day : todNight.length === limitedResultSet.length ? TimeOfDayEnum.Night : TimeOfDayEnum.Both;// if all recommendations are for day, show bestTod=day. If night, show bestTod=night. Else, show bestTod=both




const numberOfPlaces = 1;
const priceAverage = 1;
const includesPlacesOutsideCity =true;
const timeOfDay = 1;
const centralBarriosOnly = true;

    // // get distinct categories list only for the places in the result set
    // const categoryIds: Array<PlaceDocument['categoryId']> = [];
    // limitedResultSet.forEach(p => {
    //   if (categoryIds.indexOf(p.categoryId) === -1) {
    //     categoryIds.push(p.categoryId);
    //   }
    // });

    
    // BUILD THE FINAL RESPONSE
    const resp: StructuredPlanResponse = {
      // @todo - planTitle can be tokenized
      planTitle,
      planTheme: theme.theme,
      itinerary: [
        ...itinerary,
        // {
        //   dayNumber: 1,
        //   action: (theme.verbs && theme.verbs.length > 0) ? theme.verbs[0] : 'Go to',
        //   places: limitedResultSet,
        //   pois: pois, // this will be a list of food and drink
        // },
      ],
      eventNotices: [],
      summary: {
        numberOfDays: 1, // @todo
        numberOfPlaces: numberOfPlaces,
        priceAverage,
        // includesPlacesOutsideCity: !allZone1,
        includesPlacesOutsideCity,
        // TODO
        easyWalking: true,
        // categoriesIncluded: categoryIds,
        categoriesIncluded: [],
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

  // private getPlanCategoriesIncluded

  private getDayByDayItinerary(theme: StructuredPlanDayProfile, allPlaces: PlaceDocument[], numberOfDays: number): StructuredPlanResponse['itinerary'] {
    const itinerary: StructuredPlanResponse['itinerary'] = [];
    let sliceLocation = 0;

    // for each day, fill up a 'bucket' of places
    // [...(new Array(numberOfDays) as undefined[])].forEach((_, dayIndexZero) => {
    // });

    // include enough places to do in 1 day, using the timeRecommended as a guide
    // the maximum number of things to do in 1 day will be about 16 (let's say 16 items of an hour each, but some places will be close to each other)

    let dayBucket = 0;
    // let placeCounter = 0;
    let placeIndex = 0;
    const maxBucket = 12; // one day=8 but allow for extra
    let dayNumber = 0;
    while (allPlaces.length > 0 && itinerary.length < numberOfDays) {
      dayNumber++;
      placeIndex = 0;
      dayBucket = 0;
      // loop through the array until we fill a bucket
      // take note of the index
      allPlaces.every((p, idx) => {
        placeIndex = idx + 1; // otherwise slice pos will be zero
        dayBucket += p.timeRecommended;
        if (dayBucket > maxBucket) {
          // stop looping
          return false;
        }
        return true;
      });

      // const sliceAt = placeCounter > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeCounter;
      const sliceAt = placeIndex > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeIndex;
      const thisDayPlaces = allPlaces.splice(0, sliceAt);
      
      itinerary.push({
        action: 'Go to',
        dayNumber: dayNumber,
        places: this.orderResultsBasedOnLatLng(thisDayPlaces),
        pois: [],
      });
    }
    // const placesToday: PlaceDocument[] = [];

    // a bucket for this day
    // let thisDayBucket = 0;
    // let placeCounter = 0;
    // let placeIndex = 0;
    // const maxBucket = 12; // one day=8 but allow for extra
    
    // allPlaces.every((p, idx) => {
    //   placeCounter++;
    //   thisDayBucket += p.timeRecommended;
    //   if (thisDayBucket > maxBucket) {
    //     return false;
    //   }
    //   return true;
    // });
    
    
    // const sliceAt = placeCounter > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeCounter;
    // // update slice location
    // sliceLocation += sliceAt;

    // const thisDayPlaces = allPlaces.slice(sliceLocation, sliceAt);
    // itinerary.push({
    //   action: 'Go to',
    //   dayNumber: dayIndexZero + 1,
    //   places: thisDayPlaces,
    //   pois: [],
    // });
    
    // // else, include enough places to do in 1 day, using the timeRecommended as a guide
    // // the maximum number of things to do in 1 day will be about 16 (let's say 16 items of an hour each, but some places will be close to each other)
    // let dayBucket = 0;
    // let placeCounter = 0;
    // const maxBucket = 12; // one day=8 but allow for extra
    // results.every((p, idx) => {
    //   placeCounter++;
    //   dayBucket += p.timeRecommended;
    //   if (dayBucket > maxBucket) {
    //     return false;
    //   }
    //   return true;
    // });

    // const sliceAt = placeCounter > DOCUMENT_LIST_RETURN_LIMIT ? DOCUMENT_LIST_RETURN_LIMIT : placeCounter;
    // limitedResultSet = results.slice(0, sliceAt);
    
    return itinerary;
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

  /** Why are we doing this...? */
  orderStructuredPlanResults = (results: PlaceDocument[]): PlaceDocument[] => {
    return results.sort((a, b) => {
      return a.popular < b.popular ? 1 : (a.popular === b.popular ? 0 : -1);
    });
  }

  /**
   * Order a list of places by considering their lat/lng values. The logic below is based on my experience of Barcelona
   * Note: Places could also be not in Barcelona
   * @param places A list of places that are logically/geographically unordered
   * @returns A list of logically ordered places, so the route is simplified as much as possible
   */
  private orderResultsBasedOnLatLng = (places: PlaceDocument[]): PlaceDocument[] => {
    // 1. Check to see if all the places are outside BCN
    // 1a. If yes, just order by up the coast or down the coast?
    // 1b. Else...

    // 2. Calculate the standard deviation of the lat/lngs to find outliers.
    // 2a. If there's 1 outlier, do this first, then:
    // 3. Group the places by barrio and order them up or down / left to right
    
    // More: could also put the day time activities first, then night time towards the end.
    // Or...build a score sorting algorithm so score places based on: bestTod, popularity, timeRecommended, budget, daytrip, seasonal, annualOnly, availableSundays
    // This would be on the whole resultset though and not the subset
    
    // If all places are in BCN

    const allInsideBcn = places.every(p => p.barrioId !== 86);
    const allOutsideBcn = !allInsideBcn;
    const someOutsideBcn = places.some(p => p.barrioId === 86);
    // true if more than half of the places are in BCN
    // const mainlyInBcn = (places.filter(p => p.barrioId !== 86).length / places.length) > 0.5;
    
    // all places which are outside BCN
    const placesOutsideBcn = places.filter(p => p.barrioId === 86);
    // all places which are inside BCN
    const placesInsideBcn = places.filter(p => p.barrioId !== 86);

    const placesAllInCentralBarrios = places.every(p => {
      // return true if barrio is raval, gothic or born
      return [...CENTRAL_BARRIO_IDS].indexOf(p.barrioId) > -1;
    });

    // const stdDevLats = standardDeviation(places.map(p => p.lat));
    // const stdDevLngs = standardDeviation(places.map(p => p.lng));
    // console.log({stdDevLats, stdDevLngs});

    if (allOutsideBcn) {
      // all outside BCN
      // order so route comes towards BCN.
      // at the moment, just do lat asc/desc
      return places.sort(sortByLngDesc);
    } else if (allInsideBcn) {
      // all inside BCN

      // check neighbourhoods here...
      // maybe do none-central neighbourhoods first, then do central one's last, or check home location
      return places.sort(sortByLngAsc);

    } else {
      // some inside and some outside. Put outside first, then order inside
      const orderedOutside = placesOutsideBcn.sort(sortByLngDesc);
      const orderedInside = placesInsideBcn.sort(sortByLngDesc);

      return [
        ...orderedOutside,
        ...orderedInside,
      ];
    }
    

  }

  private sortResultSubset = (theme: StructuredPlanDayProfile, subsetPlaces: PlaceDocument[]): PlaceDocument[] => {
    // order by popularity
    // results = this.orderStructuredPlanResults(results);
    if (!theme.orderBy) return subsetPlaces;
    const shouldOrderSet = theme.orderBy && theme.orderBy.length > 0;
    if (!shouldOrderSet) return subsetPlaces;

    const sortKey = theme.orderBy[0].key;
    const valueType = theme.orderBy[0].valueType ?? 'NUMBER';
    const sortDirection = theme.orderBy[0].direction;
    
    // order results by array items
    // ...could be multiple sort levels @todo
    
    return subsetPlaces.sort((a, b) => {
      // sort randomly!
      if (sortDirection === 'RANDOM') {
        return Math.random() > 0.5 ? 1 : -1;
      }

      const aVal: any = a[sortKey];
      const bVal: any = b[sortKey];
      switch (valueType) {
        case 'BOOLEAN': 
          return aVal === true && bVal === false ? 1 : (aVal === true && bVal === true ? 0 : -1);
        
        default:
          return aVal > bVal ? 1 : (aVal === bVal ? 0 : -1);
      }
    });
  }
}

// These sorting algorithms are super approximate!

/** Sort by sea -> mountain */
const sortByLatAsc = (a: PlaceDocument, b: PlaceDocument) => {
  return a.lat < b.lat ? 1 : -1;
};
/** Sort by mountain -> sea */
const sortByLatDesc = (a: PlaceDocument, b: PlaceDocument) => {
  return a.lat > b.lat ? 1 : -1;
};
/** Sort by tarragona -> girona */
const sortByLngAsc = (a: PlaceDocument, b: PlaceDocument) => {
  return a.lng > b.lng ? 1 : -1;
};
/** Sort by girona -> tarragona */
const sortByLngDesc = (a: PlaceDocument, b: PlaceDocument) => {
  return a.lng < b.lng ? 1 : -1;
};

/**
 * Calculate the standard deviation of an array of numbers
 * @url https://www.geeksforgeeks.org/how-to-get-the-standard-deviation-of-an-array-of-numbers-using-javascript/
 * @param arr The array of numbers
 * @returns The standard deviation of the numbers
 */
function standardDeviation(arr: number[]): {
  stdDev: number;
  variance: number;
} {
  if (arr.length === 0) return {
    stdDev: 0,
    variance: 0,
  };
  
  // Creating the mean with Array.reduce
  const mean = arr.reduce((acc, curr) => {
    return acc + curr
  }, 0) / arr.length;
  
  // Assigning (value - mean) ^ 2 to every array item
  arr = arr.map((k) => {
    return (k - mean) ** 2
  });
  
  // Calculating the sum of updated array
  let sum = arr.reduce((acc, curr) => acc + curr, 0);
  
  // Calculating the variance
  const variance = sum / arr.length
  const stdDev = Math.sqrt(sum / arr.length);
  // Returning the standard deviation
  return {
    stdDev,
    variance,
  };
}
