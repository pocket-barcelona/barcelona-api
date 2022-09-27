import {
  Document,
  DocumentObjectFromSchemaSettings,
} from "dynamoose/dist/Document";
import { ObjectType } from "dynamoose/dist/General";
import { SerializerOptions } from "dynamoose/dist/Serializer";
import { CategoryDocument, CategoryInput } from "./category.model";
import { CategoryIdEnum } from "./enums/categoryid.enum";
import { ChildrenEnum } from "./enums/children.enum";
import { CommitmentEnum } from "./enums/commitment.enum";
import { PriceEnum } from "./enums/price.enum";
import { ProfileTypeEnum } from "./enums/profiletype.enum";
import { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import { TeenagerEnum } from "./enums/teenager.enum";
import { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import { TimeOfDayEnum } from "./enums/tod.enum";
import { EventInput } from "./event.model";
import { PlaceDocument, PlaceInput } from "./place.model";
import { PlanThemeEnum } from "./planThemes.model";
import { PoiInput } from "./poi.model";

/** The response of the structured plan */
export interface StructuredPlanResponse {
  /** The title of the plan */
  planTitle: string;
  /** The theme of the plan used to seed the list of places. Same seed will produce random places each time */
  planTheme: PlanThemeEnum;
  /** The itinerary */
  itinerary: {
    dayNumber: number;
    /** The action the person will take. Examples:
     * Eat breakfast, have lunch, coffee's, dessert, dinner @, Drink cocktails @, etc...
     */
    action: string;
    /** The place or list of places for this action */
    places: PlaceInput[];
    pois: PoiInput[];
  }[];
  /** @todo - the URL for saving this exact itinerary for later */
  itinerarySaveUrl?: string;
  eventNotices: EventInput[];

  /** See itinerary summary model from PB */
  summary: {
    numberOfDays: number;
    numberOfPlaces: number;
    /** Use budget ENUM */
    budget: number;
    /** should include places outside the city of Barcelona or not */
    includesPlacesOutsideCity: boolean;
    easyWalking: boolean;
    categoriesIncluded: Array<CategoryDocument["categoryId"]>;
    /** Spend time in 1 place or move around. Use ENUM */
    focusOnSameLocation: number;
    /** TOD Enum */
    timeOfDay: number;
    /** Plan is focussed on central neighbourhoods only */
    visitCentralBarriosOnly: boolean;
    excludePlaceIds: Array<PlaceDocument["placeId"]>;
    visitingWithPets: boolean;
    visitingWithChildren: boolean;
    visitingWithTeenagers: boolean;
    includesFoodRecommendations: boolean;
    includesDrinkRecommendations: boolean;

    includesEventNotices: boolean;

    routeIsOptimized?: boolean;
    planAuthor?: string;
    planOrganiser?: string;
  };
}


/** The data required to generate a structured plan itinerary */
export interface PlanBuilderInput {
  /** Selects a specific theme by ID - for testing */
  themeId?: number;
  /** The type of traveller that the plan is for */
  // profileType: ProfileTypeEnum;
  /** Number of days for this plan: 1-7 */
  numberOfDays: number;
  /** Budget € - €€€€€ */
  budget: PriceEnum;
  /** Array of category IDs (requires min 3) */
  categoryIds: Array<CategoryInput["categoryId"]>;
  /** Visit places outside BCN: boolean (Do you want to include day trips outside of Barcelona?) */
  includePlacesOutsideBarcelona: boolean;
  /** Can you walk between places easily? */
  walkBetweenPlacesEnabled: boolean;
  /** Time spent at each location: small or lots: 0 = any/don't mind */
  timeRecommended: TimeRecommendedEnum | 0;
  /** The preferred time of day, or 0=any */
  preferredTimeOfDay: TimeOfDayEnum | 0;
  /** Focus results on central neighbourhoods only? NULL=don't mind */
  centralBarriosOnly: boolean | null;
  /** A list of place IDs to not include in the results */
  excludePlaceIds: Array<PlaceInput["placeId"]>;
  /** Are you visiting with pet/s? */
  visitingWithPets: boolean;
  /** Visiting with kids (less than 13) */
  visitingWithKids: boolean;
  /** Visiting with teenagers (less than 18) */
  visitingWithTeenagers: boolean;
  /** Whether or not to include food recommendations */
  includeFoodSuggestions: boolean;
  /** Whether or not to include drink recommendations */
  includeDrinkSuggestions: boolean;
  /** Whether or not to include late bar and night club suggestions */
  includeNightclubSuggestions: boolean;

  // ADVANCED

  /** Which dates will you be visiting? */
  travelDates?: {
    from: number;
    to: number;
  };
  /** Remarks about events which may be of interest or coincide with the recommended places */
  includeEventRemarks?: boolean;
  /** If true, booking remarks will be included in the results. Ex. ensure you book a ticket at this place before going... */
  bookingRemarks?: boolean;
  /** If given, results will be based on this location. @todo - could use barrio Ids instead */
  homeCentrePoint?: {
    lat: number;
    lng: number;
  };
  /** Try to include places and food/drink options near to the sea */
  preferPlacesNearTheSea?: boolean;
  /** True if has access to a car */
  hasCar?: boolean;
}

