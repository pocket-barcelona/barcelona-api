/** biome-ignore-all lint/correctness/noUnusedImports: WIP */
import type { CategoryDocument, CategoryInput } from './category.model.js';
import { CategoryIdEnum } from './enums/categoryid.enum.js';
import { ChildrenEnum } from './enums/children.enum.js';
import { CommitmentEnum } from './enums/commitment.enum.js';
import type { PriceEnum } from './enums/price.enum.js';
import { ProfileTypeEnum } from './enums/profiletype.enum.js';
import { RequiresBookingEnum } from './enums/requiresbooking.enum.js';
import { TeenagerEnum } from './enums/teenager.enum.js';
import type { TimeRecommendedEnum } from './enums/timerecommended.enum.js';
import type { TimeOfDayEnum } from './enums/tod.enum.js';
import type { EventInput } from './event.model.js';
import type { PlaceDocument, PlaceInput } from './place.model.js';
import type { PlanThemeEnum } from './planThemes.js';
import type { PoiInput } from './poi.model.js';

/** The response of the structured plan */
export interface StructuredPlanResponse {
	/** The title of the plan */
	planTitle: string;
	/** The theme of the plan used to seed the list of places. Same seed will produce random places each time */
	planTheme: PlanThemeEnum;
	/** The itinerary */
	itinerary: {
		/** The day number of the itinerary starting at 1 */
		dayNumber: number;
		/** The action the person will take. Examples:
		 * Eat breakfast, have lunch, coffee's, dessert, dinner @, Drink cocktails @, etc...
		 */
		action: string;
		/** The place or list of places for this action */
		places: PlaceDocument[];
		pois: PoiInput[];
	}[];
	/** @todo - the URL for saving this exact itinerary for later */
	itinerarySaveUrl?: string;
	eventNotices: EventInput[];

	/** See itinerary summary model from PB */
	summary: {
		/** The number of days for the whole itinerary */
		numberOfDays: number;

		/** A count of the number of places in all the days */
		numberOfPlaces: number;
		/** This will be an average price. Ex. Cheap/Free/Very Cheap/Free/Free (4, 1, 2, 1, 1) = 9 / 5 places = 1.8 average */
		priceAverage: number;
		/** If dataset contains a place outside the city of Barcelona, set as true */
		includesPlacesOutsideCity: boolean;
		/** @todo - if places are all close, mark as true */
		easyWalking: boolean;
		/** A distinct list of the categories in the result set */
		categoriesIncluded: Array<CategoryDocument['categoryId']>;
		/** Spend time in 1 place or move around. Use ENUM */
		// focusOnSameLocation: number;
		/** Create an average time of day. Could be day, night or both */
		timeOfDay: TimeOfDayEnum;
		/** Focus results on central neighbourhoods only? 1=Yes,2=No,NULL=don't mind */
		centralBarriosOnly: boolean;
		excludePlaceIds: Array<PlaceDocument['placeId']>;

		/** @todo... */
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
	// themeId?: number;
	/** The type of traveller that the plan is for */
	// profileType: ProfileTypeEnum;
	/** Number of days for this plan: 1-7 */
	numberOfDays: number;
	/** Budget € - €€€€€ */
	budget: PriceEnum;
	/** Array of category IDs (requires min 3) */
	categoryIds: Array<CategoryInput['categoryId']>;
	/** Visit places outside BCN: boolean (Do you want to include day trips outside of Barcelona?) */
	includePlacesOutsideBarcelona: boolean;
	/** Can you walk between places easily? */
	walkBetweenPlacesEnabled: boolean;
	/** Time spent at each location: small or lots: 0 = any/don't mind */
	timeRecommended: TimeRecommendedEnum | 0;
	/** The preferred time of day, or 0=any */
	preferredTimeOfDay: TimeOfDayEnum | 0;
	/** Focus results on central neighbourhoods only? true=Yes,false=Do not limit */
	centralBarriosOnly: boolean;
	/** In contrast with `centralBarriosOnly`, specify to include one or more barrios */
	barrioIds: Array<PlaceInput['barrioId']>;
	/** A list of place IDs to not include in the results */
	excludePlaceIds: Array<PlaceInput['placeId']>;
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
