import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
} from "../../../models/planThemes.model";
import { FoodCategoryEnum } from "../../../models/enums/foodcategory.enum";
import { TimeOfDayEnum } from '../../../models/enums/tod.enum';
import { CategoryIdEnum } from '../../../models/enums/categoryid.enum';

const themes: StructuredPlanDayProfile[] = [
  {
    id: 101,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "The Gothic Quarter and El Born",
    barrioIds: [12, 13],
    categoryIds: [CategoryIdEnum.BarsRestaurants, CategoryIdEnum.Plazas, CategoryIdEnum.Museums, CategoryIdEnum.Buildings],
    foodCategories: [
      // @todo
      FoodCategoryEnum.Dinner,
    ],
  },
  {
    id: 102,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of El Raval",
    barrioIds: [11],
    popular: true,
    seasonal: false,
    // more?
  },
  {
    id: 103,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of Sant Antoni",
    barrioIds: [20],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 104,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of Gràcia",
    barrioIds: [38],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 105,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of El Born",
    barrioIds: [13],
    seasonal: false,
    orderBy: [
      {
        key: "popular",
        direction: "ASC",
        valueType: "BOOLEAN",
      },
    ],
    // popular: true,
    // more?
  },
  {
    id: 106,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of Barrio Gótico",
    barrioIds: [12],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 107,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of La Barceloneta",
    barrioIds: [14],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 108,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of Eixample",
    barrioIds: [15, 16, 17],
    seasonal: false,
    // popular: true,
    // more?
  },

  {
    // to check...
    id: 109,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Top 10 City Attractions In Barcelona",
    // barrioIds: [15,16,17],
    seasonal: false,
    popular: true,
    daytrip: 0,
    limit: 10,
  },
  {
    // to check
    id: 110,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of Poblenou",
    barrioIds: [77, 78, 79, 80, 83],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    // to check
    id: 111,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of El Clot",
    barrioIds: [75, 76],
    seasonal: false,
  },
  {
    // to check
    id: 112,
    theme: PlanThemeEnum.Location,
    themeTod: TimeOfDayEnum.Day,
    name: "Best of La Sagrada Familia (neighbourhood)",
    barrioIds: [19, 18, 17],
    seasonal: false,
    placeIdsExclude: [305],
  },
];
export default themes;
