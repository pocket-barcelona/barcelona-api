// import { TEST_RESPONSE_PLAN_1 } from "../../../input/plan.input.js";
/** biome-ignore-all lint/correctness/noUnusedVariables: WIP */
import type { Scan } from 'dynamoose/dist/ItemRetriever.js';
import { themesTestData } from '../../../collections/themes/themesTestData.js';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum.js';
import PlaceModel, { type PlaceDocument } from '../../../models/place.model.js';
import type { StructuredPlanResponse } from '../../../models/plan.model.js';
import { PlanThemeEnum, type StructuredPlanDayProfile } from '../../../models/planThemes.js';
import type { PoiDocument } from '../../../models/poi.model.js';
import { PlanHelper } from './createStructuredPlan.helper.js';
import { getMultipleRandomItemsFromArray, getRandomItemFromArray } from './utils.js';

const DOCUMENT_SCAN_LIMIT = 2500;

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
const isLandmarkField: keyof PlaceDocument = 'isLandmark';
const requiresBookingField: keyof PlaceDocument = 'requiresBooking';
const metroZoneField: keyof PlaceDocument = 'metroZone';
const latField: keyof PlaceDocument = 'lat';
const lngField: keyof PlaceDocument = 'lng';

/**
 * Generate a random plan for 1 day
 * @returns
 */
export default async function (): Promise<StructuredPlanResponse | null> {
	try {
		const helper = new PlanHelper();
		const timeHourNow = new Date().getHours(); // will be like 9 or 17 (9am or 5pm)
		// RANDOM

		let theme: StructuredPlanDayProfile;
		// let's say that anything after 1pm is the afternoon/night
		if (timeHourNow >= 13) {
			// only consider plans which are night time
			theme = getRandomItemFromArray(
				themesTestData.filter((p) => p.themeTod !== TimeOfDayEnum.Day)
			);
		} else {
			// only consider plans which are not night
			theme = getRandomItemFromArray(
				themesTestData.filter((p) => p.themeTod !== TimeOfDayEnum.Night)
			);
		} // todo - could check multiple times of day: day, night, both

		// SPECIFIC - FOR TESTING
		// const themeId = 1041;
		// const theme = themesTestData.find((t) => t.id === themeId);
		if (!theme) {
			throw new Error('Invalid theme ID');
		}

		const {
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
		} = helper.getThemeInputParams(theme);

		let documents: Scan<PlaceDocument>;

		documents = PlaceModel.scan().where(activeField).eq(true);

		documents.and().where(availableDailyField);

		// filter out places which are not available on sundays if it's sunday today
		const isSundayToday = new Date().getDay() === 0;
		if (isSundayToday) {
			documents.and().where(availableSundaysField).eq(true);
		}

		const placeIdsSubset =
			theme.placeIds &&
			theme.placeIdsChooseAmount !== undefined &&
			hasPlaceIds &&
			hasPlaceIdsChooseAmount
				? getMultipleRandomItemsFromArray(theme.placeIds, theme.placeIdsChooseAmount)
				: theme.placeIds || [];

		const barrioIdsSubset =
			theme.barrioIds &&
			theme.barrioIdsChooseAmount !== undefined &&
			hasBarrioIds &&
			hasBarrioIdsChooseAmount
				? getMultipleRandomItemsFromArray(theme.barrioIds, theme.barrioIdsChooseAmount)
				: theme.barrioIds || [];

		const categoryIdsSubset =
			theme.categoryIds &&
			theme.categoryIdsChooseAmount !== undefined &&
			hasCategoryIds &&
			hasCategoryIdsChooseAmount
				? getMultipleRandomItemsFromArray(theme.categoryIds, theme.categoryIdsChooseAmount)
				: theme.categoryIds || [];

		// decide how to query the places table
		switch (theme.theme) {
			case PlanThemeEnum.Category: {
				if (!hasCategoryIds) {
					throw new Error('categoryIds required');
				}

				documents.and().where(categoryIdField).in(categoryIdsSubset);

				// decide how to query
				if (hasBarrioIds && hasPlaceIds) {
					documents
						.and()
						.where(barrioIdField)
						.in(barrioIdsSubset)
						.and()
						.where(placeIdField)
						.in(placeIdsSubset);
				} else if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				} else if (hasPlaceIds) {
					documents.and().where(placeIdField).in(placeIdsSubset);
				}

				break;
			}
			case PlanThemeEnum.Location: {
				if (!hasBarrioIds) {
					throw new Error('barrioIds required');
				}

				if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				}

				// .and().where(placeIdField).in(placeIdsSubset);

				// do a query based on location using barrio IDs or lat/lng

				if (categoryIdsSubset.length) {
					documents.and().where(categoryIdField).in(categoryIdsSubset);
				}

				// if (hasBarrioIds && hasPlaceIds) {
				//   documents
				//   .and().where(barrioIdField).in(barrioIdsSubset)
				//   .and().where(placeIdField).in(placeIdsSubset);
				// } else if (hasBarrioIds) {
				//   documents
				//   .and().where(barrioIdField).in(barrioIdsSubset);
				// } else if (hasPlaceIds) {
				//   documents
				//   .and().where(placeIdField).in(placeIdsSubset);
				// }
				break;
			}
			case PlanThemeEnum.Trips: {
				if (hasPlaceIds) {
					documents.where(placeIdField).in(placeIdsSubset);
				}
				if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				}
				if (hasCategoryIds) {
					documents.and().where(categoryIdField).in(categoryIdsSubset);
				}

				break;
			}
			case PlanThemeEnum.FoodAndDrink: {
				// handle all params in food and drink, but consider barrioIds and categoryIds
				if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				}
				if (hasCategoryIds) {
					documents.and().where(categoryIdField).in(categoryIdsSubset);
				}
				break;
			}
			case PlanThemeEnum.NightsOut: {
				// handle all params in drink categories, but consider barrioIds and categoryIds
				if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				}
				if (hasCategoryIds) {
					documents.and().where(categoryIdField).in(categoryIdsSubset);
				}
				break;
			}
			case PlanThemeEnum.BestOf: {
				// handle all params
				if (hasBarrioIds) {
					documents.and().where(barrioIdField).in(barrioIdsSubset);
				}
				if (hasCategoryIds) {
					documents.and().where(categoryIdField).in(categoryIdsSubset);
				}
				break;
			}
			case PlanThemeEnum.Route: {
				documents.and().where(placeIdField).in(placeIdsSubset);

				break;
			}
			default: {
				// unhandledParams = true;
				// break;
				return null;
			}
		}

		// general param filters
		if (hasProvinceId) {
			documents.and().where(provinceIdField).eq(theme.provinceId);
		}
		if (hasMetroZones) {
			documents.and().where(metroZoneField).in([theme.metroZone]);
		}
		if (hasSeasonal) {
			documents.and().where(seasonalField).eq(theme.seasonal);
		}
		if (hasDaytrip) {
			documents.and().where(daytripField).eq(theme.daytrip);
		}
		if (hasPopular) {
			documents.and().where(popularField).eq(theme.popular);
		}
		if (hasAnnualOnly) {
			documents.and().where(annualOnlyField).eq(theme.annualOnly);
		}
		if (Number.isInteger(hasFreeToVisit)) {
			documents.and().where(freeToVisitField).eq(theme.freeToVisit);
		}

		// keyword
		// start
		// end
		// center, radius
		if (hasTimeRecommendedOptions) {
			documents.and().where(timeRecommendedField).in(theme.timeRecommendedOptions);
		}
		if (hasRequiresBookingOptions) {
			documents.and().where(requiresBookingField).in(theme.requiresBookingOptions);
		}
		if (hasPhysicalLandmark) {
			documents.and().where(isLandmarkField).in(theme.isLandmark);
		}

		// if (hasExcludePlaceIds) {
		//   documents
		//   .and().where(placeIdField).in(theme.placeIdsExclude).not();
		// }

		// do a query by category and then process the results

		let results: PlaceDocument[] = [];
		try {
			const allResults = await documents.limit(DOCUMENT_SCAN_LIMIT).exec();
			results = allResults.toJSON() as PlaceDocument[];
		} catch (_error: unknown) {
			return null;
		}

		// get food and drink documents if theme allows it
		let foodDrinkResults: PoiDocument[] = [];
		if (hasFoodCategories) {
			console.log('Fetching food and drink documents...');
			foodDrinkResults = await helper.fetchFoodAndDrinkDocuments(theme, results);
		}

		// build response

		// const dayNumber = 1; // random plans only have 1 day
		const thePlan = helper.buildPlanResponse(theme, results, foodDrinkResults, 1);
		if (thePlan) {
			return thePlan;
		}

		// return TEST_RESPONSE_PLAN_1;
		return null;
	} catch (_e: unknown) {
		return null;
	}
}
