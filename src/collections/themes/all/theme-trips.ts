import { FoodCategoryEnum } from '../../../models/enums/foodcategory.enum';
import { PlanThemeEnum, StructuredPlanDayProfile } from '../../../models/planThemes.model';

const themes: StructuredPlanDayProfile[] = [
  {
    id: 300,
    theme: PlanThemeEnum.Trips,
    name: "Testing Bars and Restaurants Data",
    barrioIds: [12],
    seasonal: false,
    placeIds: [19],
    foodCategories: [
      // @todo
      FoodCategoryEnum.Dinner,
    ],
    limit: 1,
  },
  { // @todo - cannot see the sea from some!
    id: 301,
    theme: PlanThemeEnum.Trips,
    // could be "Top X ..."
    name: "Top 5 Sea Viewpoints", // change to Incredible not Top?
    categoryIds: [8],
    limit: 5,
    physicalLandmark: true,
    // placeIds: [],
  },
  {
    id: 302,
    theme: PlanThemeEnum.Trips,
    name: "Park Guell and Lunch",
    verbs: ['Go to'],
    // barrioIds: [40], // helps with accuracy of food/drink recommendations
    placeIds: [45, 270],
    placeIdsOptional: [283],
    placeIdsAreOrdered: true,
  },
  {
    id: 303,
    theme: PlanThemeEnum.Trips,
    verbs: ['Daytrip to'],
    name: "Day trip to {place}",
    categoryIds: [6],
    provinceId: 2,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    limit: 1,
    physicalLandmark: true,
  },
  { // untested
    id: 304,
    theme: PlanThemeEnum.Trips,
    name: "Costa Brava Daytrip",
    barrioIds: [86],
    provinceId: 2,
    orderBy: [
      {
        key: 'lat',
        direction: 'DESC',
      }
    ],
    limit: 3,
    physicalLandmark: true,
  },
  { // untested
    id: 305,
    theme: PlanThemeEnum.Trips,
    name: "Mini daytrip to {place}",
    categoryIds: [8],
    provinceId: 2,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    limit: 1,
    physicalLandmark: true,
  },
];
export default themes;
