/** biome-ignore-all lint/correctness/noUnusedImports: WIP */
/** biome-ignore-all lint/correctness/noUnusedVariables: WIP */
import type { Scan } from 'dynamoose/dist/ItemRetriever.js';
import { getStaticBarrioById } from '../../../collections/barrios/data.js';
import { CENTRAL_BARRIO_IDS } from '../../../collections/themes/all/theme-category.js';
import BarrioModel, { type BarrioInput } from '../../../models/barrio.model.js';
import { CommitmentEnum } from '../../../models/enums/commitment.enum.js';
import { RequiresBookingEnum } from '../../../models/enums/requiresbooking.enum.js';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum.js';
import PlaceModel, { type PlaceDocument } from '../../../models/place.model.js';
import type { StructuredPlanResponse } from '../../../models/plan.model.js';
import { PlanThemeEnum, type StructuredPlanDayProfile } from '../../../models/planThemes.js';
// import { themesTestData } from "../../../collections/themes/themesTestData.js";
import type { PoiDocument } from '../../../models/poi.model.js';
import type { BuildPlanInput } from '../../../schema/planner/planner.schema.js';
import { PlanHelper } from './createStructuredPlan.helper.js';

const DOCUMENT_SCAN_LIMIT = 2500;

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
export default async function (
	input: BuildPlanInput['body']
): Promise<StructuredPlanResponse | null> {
	let documents: Scan<PlaceDocument>;
	const helper = new PlanHelper();
	const {
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
		isLandmarkField,
		requiresBookingField,
		metroZoneField,
		latField,
		lngField,
	} = helper.fields();
	const now = Date.now();

	const oneDayMs = 60 * 60 * 24 * 1000;
	const tomorrowTimestamp = now + oneDayMs;
	const hasDates = input.travelDates?.from && input.travelDates.to ? input.travelDates : null;
	const theme: StructuredPlanDayProfile = {
		id: 0,
		themeTod: TimeOfDayEnum.Both, // check hour now...
		name: 'Custom Itinerary',
		theme: PlanThemeEnum.Custom,
		verbs: ['Go to'],
		dateStart: hasDates ? hasDates.from : now,
		dateEnd: hasDates ? hasDates.to : new Date(tomorrowTimestamp).getTime(),
	};

	const categoryIdsSubset =
		input.categoryIds && input.categoryIds.length > 0 ? input.categoryIds : [];
	const hasBudget = input.budget <= 1 ? 1 : input.budget > 32 ? 32 : input.budget;
	const hasTimeSpent = (input.timeRecommended ?? 0) <= 0 ? 0 : input.timeRecommended;
	const hasTod = (input.preferredTimeOfDay ?? 0) <= 0 ? 0 : input.preferredTimeOfDay;
	const hasCentralBarrios = input.centralBarriosOnly === true;
	const hasBarrioIds = (input.barrioIds ?? []).length > 0;
	const hasExcludePlaceIds = input.excludePlaceIds && input.excludePlaceIds.length > 0;
	const shouldIncludeFood = input.includeFoodSuggestions === true;
	const shouldIncludeDrink = input.includeDrinkSuggestions === true;
	const shouldIncludeClubs = input.includeNightclubSuggestions === true;
	const hasPets = input.visitingWithPets === true;
	const hasKids = input.visitingWithKids === true;
	const hasTeens = input.visitingWithTeenagers === true;
	const hasWalkBetweenPlaces = input.walkBetweenPlacesEnabled === true;
	const hasAddressStringFilter = input.addressContains && input.addressContains !== '';
	const today = new Date();
	const numDays = input.numberOfDays;

	today.setHours(8);
	today.setSeconds(0);
	today.setMinutes(0);
	today.setMilliseconds(0);

	let travelDate: Date = new Date();
	if (input.travelDates?.from) {
		travelDate = new Date(input.travelDates.from);
	}
	travelDate.setHours(8);
	travelDate.setSeconds(0);
	travelDate.setMinutes(0);
	travelDate.setMilliseconds(0);

	const planIsForToday = today.getTime() <= travelDate.getTime();
	// const nextBudgetDown = hasBudget

	try {
		documents = PlaceModel.scan().where(activeField).eq(true).and().where(provinceIdField).eq(2);

		// basic filters

		// metro zone 1 - in BCN
		documents.and().where(metroZoneField).eq(1);
		// remove annual only things
		documents.and().where(annualOnlyField).eq(false);
		// remove seasonal things
		documents.and().where(seasonalField).eq(false);
		// remove partially available things
		documents.and().where(availableDailyField).eq(true);
		// remove non-landmarks
		documents.and().where(isLandmarkField).eq(true);

		// include sunday items if it's sunday today
		if (today.getDay() === 0) {
			documents.and().where(availableSundaysField).eq(true);
		}

		// check booking requirements...
		// if travel date is in the future, allow items which have requires booking in the future, else hide them
		if (planIsForToday) {
			documents
				.and()
				.where(requiresBookingField)
				.in([RequiresBookingEnum.No, RequiresBookingEnum.OnArrival, RequiresBookingEnum.SameDay]);
		}

		// filter out places which require a lot of commitment to get to
		if (!hasWalkBetweenPlaces) {
			documents
				.and()
				.where(commitmentRequiredField)
				.in([CommitmentEnum.Casual, CommitmentEnum.Easy]);
		}

		// filter by budget up to this budget
		if (hasBudget) {
			documents.and().where(priceField).le(hasBudget); // find everything up to this budget
		}

		// filter by one or more categories
		if (categoryIdsSubset.length > 0) {
			documents.and().where(categoryIdField).in(categoryIdsSubset);
		}

		// include places outside Barcelona
		if (input.includePlacesOutsideBarcelona) {
			documents.and().where(daytripField).in([0, 1]);
			// .where(daytripField).in([0, 1, 2]); // @todo - include places outside Spain?!
		} else {
			documents.and().where(daytripField).in([0]);
		}

		if (hasTimeSpent) {
			documents.and().where(timeRecommendedField).eq(input.timeRecommended);
		}

		if (hasTod) {
			documents.and().where(bestTodField).eq(input.preferredTimeOfDay);
		}

		let filteredByBarrioIds = hasBarrioIds ? input.barrioIds : [];
		if (hasCentralBarrios) {
			filteredByBarrioIds = filteredByBarrioIds.concat(CENTRAL_BARRIO_IDS);
		}
		const uniqueBarrioIds = new Set(filteredByBarrioIds);
		if (uniqueBarrioIds.size > 0) {
			documents
				.and()
				.where(barrioIdField)
				.in([...uniqueBarrioIds]);
		}

		if (hasKids) {
			// if tourists have kids, only show kids suitable things
			documents.and().where(childrenSuitabilityField).eq(hasKids);
		}

		if (hasTeens) {
			// if tourists have teenagers, only show teenager suitable things
			documents.and().where(teenagerSuitabilityField).eq(hasTeens);
		}

		// TO ADD to data
		// if (hasPets) {
		//   // filter by places which are only suitable for pets
		//   documents.and()
		//   .where(petSuitabilityField).eq(hasPets)
		// }

		// WORK OUT HOW TO DO "NOT IN"
		// if (hasExcludePlaceIds) {
		//   documents.and()
		//   .where(barrioIdField).not().in(input.excludePlaceIds);
		// }

		let results: PlaceDocument[] = [];
		try {
			const allResults = await documents.limit(DOCUMENT_SCAN_LIMIT).exec();
			results = allResults.toJSON() as PlaceDocument[]; // will contain all results
			// if (results.length === 0) {
			// 	return null;
			// }
		} catch (error) {
			return null;
		}

		// if no place results, make sure there's a barrio as we need a lat/lng
		if (results.length === 0 && filteredByBarrioIds.length === 0) {
			return null;
		}

		let relatedBarrio: BarrioInput | null = null;
		if (results.length === 0) {
			const firstBarrio = input.barrioIds[0];
			relatedBarrio = getStaticBarrioById(firstBarrio);
			if (!relatedBarrio) {
				return null;
			}
		}

		// PUT THIS ELSEWHERE?

		let foodDrinkResults: PoiDocument[] = [];
		if (shouldIncludeFood || shouldIncludeDrink || shouldIncludeClubs) {
			const latLng = {
				lat: relatedBarrio?.centre.lat ?? 41.387023, // plaza cat!
				lng: relatedBarrio?.centre.lng ?? 2.170051,
			};

			foodDrinkResults = await helper.fetchFoodAndDrinkDocuments(theme, results, latLng);
		}

		const thePlan = helper.buildPlanResponse(theme, results, foodDrinkResults, numDays);
		return thePlan;

		// console.log('Number of results: ', results.length);
	} catch (error) {
		console.warn(error);
		return null;
	}
}
