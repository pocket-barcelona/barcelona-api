/** biome-ignore-all lint/correctness/noUnusedImports: WIP */
import { CategoryIdEnum } from '../models/enums/categoryid.enum.js';
import { ChildrenEnum } from '../models/enums/children.enum.js';
import { CommitmentEnum } from '../models/enums/commitment.enum.js';
import { PriceEnum } from '../models/enums/price.enum.js';
import { RequiresBookingEnum } from '../models/enums/requiresbooking.enum.js';
import { TeenagerEnum } from '../models/enums/teenager.enum.js';
import { TimeRecommendedEnum } from '../models/enums/timerecommended.enum.js';
import { TimeOfDayEnum } from '../models/enums/tod.enum.js';
import type { PlaceInput } from '../models/place.model.js';
import { type PlanBuilderInput, StructuredPlanResponse } from '../models/plan.model.js';
// import { PlanThemeEnum } from "../models/planThemes.js";

/** A Fake input for creating a structured plan */
export const TEST_INPUT_PLAN_1: PlanBuilderInput = {
	// profileType: ProfileTypeEnum.FutureHoliday,
	numberOfDays: 3,
	budget: PriceEnum.Cheap,
	categoryIds: [1, 5, 7, 8],
	includePlacesOutsideBarcelona: false,
	walkBetweenPlacesEnabled: true,
	timeRecommended: TimeRecommendedEnum.QuarterDay,
	preferredTimeOfDay: 0,
	centralBarriosOnly: 2,
	barrioIds: [19],
	excludePlaceIds: [21],
	visitingWithPets: false,
	visitingWithKids: false,
	visitingWithTeenagers: false,
	includeFoodSuggestions: true,
	includeDrinkSuggestions: true,
	includeNightclubSuggestions: true,
};

// const TEST_PLACE: PlaceInput = {
// 	placeId: 3,
// 	active: true,
// 	provinceId: 2,
// 	placeTown: 'Barcelona',
// 	barrioId: 13,
// 	categoryId: CategoryIdEnum.Buildings,
// 	labelCat: 'Arc De Triomf',
// 	labelEsp: 'Arc De Triomf',
// 	labelEng: 'Arc De Triomf',
// 	slug: 'arc-de-triomf',
// 	remarks: '',
// 	description: 'A monumental archway near to El Born and the city park',
// 	timeRecommended: TimeRecommendedEnum.CoupleOfHours,
// 	bestTod: TimeOfDayEnum.Day,
// 	commitmentRequired: CommitmentEnum.Casual,
// 	price: PriceEnum.Free,
// 	freeToVisit: 0,
// 	childrenSuitability: ChildrenEnum.Suitable,
// 	teenagerSuitability: TeenagerEnum.Recommended,
// 	touristAttraction: false,
// 	popular: true,
// 	boost: 0,
// 	annualOnly: false,
// 	seasonal: false,
// 	daytrip: 0,
// 	availableDaily: true,
// 	availableSundays: true,
// 	isLandmark: true,
// 	isPhysicalLocation: 1,
// 	requiresBooking: RequiresBookingEnum.No,
// 	metroZone: 1,
// 	latlngAccurate: true,
// 	lat: 41.391055,
// 	lng: 2.180644,
// 	mapZoom: 0,
// 	website: '',
// 	relatedPlaceId: 0,
// 	hasImage: true,
// 	photoOwnership: 1,
// 	tags: 'arc',
// };

// export const TEST_RESPONSE_PLAN_1: StructuredPlanResponse = {
//   planTitle: "Some plan",
//   planTheme: PlanThemeEnum.BestOf,
//   itinerary: [
//     {
//       dayNumber: 1,
//       action: "",
//       places: [
//         {
//           ...TEST_PLACE,
//         },
//       ],
//       pois: [],
//     },
//   ],
//   eventNotices: [],
//   summary: {
//     numberOfDays: 1,
//     numberOfPlaces: 1,
//     priceAverage: 0,
//     includesPlacesOutsideCity: false,
//     easyWalking: true,
//     categoriesIncluded: [TEST_PLACE.categoryId],
//     // focusOnSameLocation: 1,
//     timeOfDay: 1,
//     centralBarriosOnly: true,
//     excludePlaceIds: [],
//     visitingWithPets: true,
//     visitingWithChildren: true,
//     visitingWithTeenagers: true,
//     includesFoodRecommendations: true,
//     includesDrinkRecommendations: true,
//     includesEventNotices: false,
//   },
// };
