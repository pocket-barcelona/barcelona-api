import { CategoryIdEnum } from '../../../models/enums/categoryid.enum';
import { TimeOfDayEnum } from '../../../models/enums/tod.enum';
import { StructuredPlanDayProfile, PlanThemeEnum } from '../../../models/planThemes.model';

/** The barrio IDs of Raval, Gothic and Born respectively */
export const CENTRAL_BARRIO_IDS = [11, 12, 13];

const themes: StructuredPlanDayProfile[] = [
  {
    id: 201,
    theme: PlanThemeEnum.Category,
    themeTod: TimeOfDayEnum.Day,
    name: "Barcelona Beach Tour",
    categoryIds: [CategoryIdEnum.Beaches],
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
    themeTod: TimeOfDayEnum.Day,
    // @todo - support for choosing a name from the array
    name: [
      "Ancient buildings - self-guided walking tour",
      "Historical Buildings Tour",
    ],
    categoryIds: [CategoryIdEnum.Buildings],
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
    themeTod: TimeOfDayEnum.Day,
    name: "Inner-city markets tour",
    categoryIds: [CategoryIdEnum.Shopping],
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
    themeTod: TimeOfDayEnum.Day,
    name: [
      "Parks and countryside around Barcelona",
      "Parks & green spaces around BCN",
    ],
    verbs: ["Take a walk around"],
    categoryIds: [CategoryIdEnum.Parks],
    barrioIds: [35, 48, 44, 46],
    seasonal: false,
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 205,
    theme: PlanThemeEnum.Category,
    themeTod: TimeOfDayEnum.Day,
    name: "Unique Barcelona Experiences",
    categoryIds: [CategoryIdEnum.Experiences],
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
    themeTod: TimeOfDayEnum.Day,
    name: ["Cathedrals and Churches in central Barcelona"],
    categoryIds: [CategoryIdEnum.Buildings],
    barrioIds: [...CENTRAL_BARRIO_IDS],
    seasonal: false,
    placeIds: [119, 229, 12, 225, 47],
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 207,
    theme: PlanThemeEnum.Category,
    themeTod: TimeOfDayEnum.Day,
    name: "Go Shopping in Barcelona",
    categoryIds: [CategoryIdEnum.Shopping],
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
    themeTod: TimeOfDayEnum.Day,
    name: "5 Plaza's in a day",
    categoryIds: [CategoryIdEnum.Plazas],
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
    themeTod: TimeOfDayEnum.Day,
    name: "3 Museums, 1 Day",
    categoryIds: [CategoryIdEnum.Museums],
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
    themeTod: TimeOfDayEnum.Day,
    name: "Central Museums Tour, Barcelona",
    categoryIds: [CategoryIdEnum.Museums],
    placeIdsChooseAmount: 3,
    orderBy: [
      {
        key: "placeId",
        direction: "RANDOM",
      },
    ],
    metroZone: 1,
    barrioIds: [...CENTRAL_BARRIO_IDS, 14], // central + barceloneta
    limit: 3,
  },
];
export default themes;
