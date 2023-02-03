import { StructuredPlanDayProfile, PlanThemeEnum } from '../../../models/planThemes.model';

const themes: StructuredPlanDayProfile[] = [
  {
    id: 201,
    theme: PlanThemeEnum.Category,
    name: "Barcelona Beach Tour",
    categoryIds: [1],
    metroZone: 1,
    daytrip: 0,
    orderBy: [
      {
        key: "lat",
        direction: "ASC",
      },
      // {
      //   key: "lng",
      //   direction: "ASC",
      // },
    ],
    placeIdsExclude: [215],
  },
  {
    // pick a bunch of places on the way from A to B, using lat start, lng start, bearing is calculated
    // might need an ancient building flag?
    id: 202,
    theme: PlanThemeEnum.Category,
    // @todo - support for choosing a name from the array
    name: [
      "Ancient buildings - self-guided walking tour",
      "Historical Buildings Tour",
    ],
    categoryIds: [9],
    placeIdsAlwaysInclude: [119], // the cathedral
    barrioIds: [],
    start: { lat: 1.0, lng: 1.0 },
    end: { lat: 1.0, lng: 1.0 },
    limit: 15,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
  },
  {
    id: 203,
    theme: PlanThemeEnum.Category,
    name: "Inner-city markets tour",
    categoryIds: [10],
    barrioIds: [], // include central barrios
    keyword: "market",
    seasonal: false,
    freeToVisit: 1,
    // placeIds: [63], // include sant antoni market 63?
    limit: 4,
  },
  {
    id: 204,
    theme: PlanThemeEnum.Category,
    name: [
      "Parks and countryside around Barcelona",
      "Parks & green spaces around BCN",
    ],
    verbs: ["Take a walk around"],
    categoryIds: [11],
    barrioIds: [35, 48, 44, 46],
    seasonal: false,
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 205,
    theme: PlanThemeEnum.Category,
    name: "Unique Barcelona Experiences",
    categoryIds: [3],
    seasonal: false,
    placeIds: [72, 148, 71, 64, 4, 57, 58, 114, 288, 13, 154],
    placeIdsChooseAmount: 4,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    limit: 4,
  },
  {
    id: 206,
    theme: PlanThemeEnum.Category,
    name: ["Cathedrals and Churches in central Barcelona"],
    categoryIds: [9],
    barrioIds: [11, 12, 13],
    seasonal: false,
    placeIds: [119, 229, 12, 225, 47],
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 207,
    theme: PlanThemeEnum.Category,
    name: "Go Shopping in Barcelona",
    categoryIds: [10],
    placeIds: [274, 42, 21, 22, 271, 282, 10, 143, 118, 9, 142, 237],
    placeIdsChooseAmount: 5,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    // limit: 2,
  },
  {
    id: 208,
    theme: PlanThemeEnum.Category,
    name: "5 Plaza's in a day",
    categoryIds: [5],
    placeIdsChooseAmount: 5,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    metroZone: 1,
    limit: 5,
  },
  {
    id: 209,
    theme: PlanThemeEnum.Category,
    name: "3 Museums, 1 Day",
    categoryIds: [7],
    // placeIdsChooseAmount: 3,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    metroZone: 1,
    limit: 3,
  },
  {
    id: 210,
    theme: PlanThemeEnum.Category,
    name: "Central Museums Tour, Barcelona",
    categoryIds: [7],
    placeIdsChooseAmount: 3,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    metroZone: 1,
    barrioIds: [11, 12, 13, 14],
    limit: 3,
  },
];
export default themes;
