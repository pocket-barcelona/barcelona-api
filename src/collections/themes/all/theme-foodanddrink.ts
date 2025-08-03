import { CategoryIdEnum } from "../../../models/enums/categoryid.enum";
import {
	DrinkCategoryEnum,
	FoodCategoryEnum,
	FoodCuisinesEnum,
} from "../../../models/enums/foodcategory.enum";
import { TimeOfDayEnum } from "../../../models/enums/tod.enum";
import {
	PlanThemeEnum,
	type StructuredPlanDayProfile,
} from "../../../models/planThemes";

const themes: StructuredPlanDayProfile[] = [
	{
		id: 601,
		theme: PlanThemeEnum.FoodAndDrink,
		themeTod: TimeOfDayEnum.Day,
		name: "Brunch and the Beach",
		// [Poblenou/Born/Gothic/Raval]
		barrioIds: [79, 13, 12, 11], //@todo - no results sometimes as waiting for restaurants
		barrioIdsChooseAmount: 1,
		categoryIds: [CategoryIdEnum.Beaches],
		// categoryIdsChooseAmount: 1,
		foodCategories: [FoodCategoryEnum.Brunch],
	},
	{
		// @todo
		id: 602,
		theme: PlanThemeEnum.FoodAndDrink,
		themeTod: TimeOfDayEnum.Night,
		name: "Visit Plaza San Miguel's Bars & Restaurants",
		bestTod: TimeOfDayEnum.Night,
		drinkCategories: [
			DrinkCategoryEnum.CraftBeer,
			DrinkCategoryEnum.Beer,
			DrinkCategoryEnum.Cocktails,
		],
		placeIds: [31],
		internal: 0,
	},
	{
		// @todo
		id: 603,
		theme: PlanThemeEnum.FoodAndDrink,
		themeTod: TimeOfDayEnum.Night,
		name: "Enjoy Wine & Tapas in Central Barcelona",
		bestTod: TimeOfDayEnum.Night,
		drinkCategories: [
			DrinkCategoryEnum.CraftBeer,
			DrinkCategoryEnum.Beer,
			DrinkCategoryEnum.Cocktails,
		],
		placeIds: [31],
		foodCategories: [FoodCategoryEnum.Dinner],
		foodCuisines: [FoodCuisinesEnum.Spanish],
		internal: 2,
	},
];
export default themes;
