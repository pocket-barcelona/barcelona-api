import { DrinkCategoryEnum } from '../../../models/enums/foodcategory.enum.js';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum.js';
import { PlanThemeEnum, type StructuredPlanDayProfile } from '../../../models/planThemes.js';

const themes: StructuredPlanDayProfile[] = [
	{
		id: 501,
		theme: PlanThemeEnum.NightsOut,
		themeTod: TimeOfDayEnum.Night,
		name: 'Best of Craft Beer in Barcelona',
		drinkCategories: [DrinkCategoryEnum.CraftBeer],
		internal: 0,
	},
	{
		// @todo - query the address for this: d'Avinyó'. Addresses are like: "Address" : "Carrer d'Avinyó, 35, 08002 Barcelona, Spain",
		id: 502,
		theme: PlanThemeEnum.NightsOut,
		themeTod: TimeOfDayEnum.Night,
		name: "Best of Carrer d'Avinyó",
		// drinkCategories: [DrinkCategoryEnum.CraftBeer],
		internal: 0,
	},
	{
		// @todo
		id: 503,
		theme: PlanThemeEnum.NightsOut,
		themeTod: TimeOfDayEnum.Night,
		name: 'Pub Crawl, El Born',
		bestTod: TimeOfDayEnum.Night,
		drinkCategories: [
			DrinkCategoryEnum.CraftBeer,
			DrinkCategoryEnum.Beer,
			DrinkCategoryEnum.Cocktails,
		],
		internal: 0,
	},
];
export default themes;
