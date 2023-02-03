import { DrinkCategoryEnum } from '../../../models/enums/foodcategory.enum';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum';
import { StructuredPlanDayProfile, PlanThemeEnum } from '../../../models/planThemes.model';

const themes: StructuredPlanDayProfile[] = [
  {
    id: 501,
    theme: PlanThemeEnum.NightsOut,
    name: "Best of Craft Beer in Barcelona",
    drinkCategories: [DrinkCategoryEnum.CraftBeer],
    internal: 0,
  },
  {
    // @todo - query the address for this: d'Avinyó'. Addresses are like: "Address" : "Carrer d'Avinyó, 35, 08002 Barcelona, Spain",
    id: 502,
    theme: PlanThemeEnum.NightsOut,
    name: "Best of Carrer d'Avinyó",
    // drinkCategories: [DrinkCategoryEnum.CraftBeer],
    internal: 0,
  },
  {
    // @todo
    id: 503,
    theme: PlanThemeEnum.NightsOut,
    name: "Pub Crawl, El Born",
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
