import { RequiresBookingEnum } from '../../../models/enums/requiresbooking.enum';
import { TimeRecommendedEnum } from '../../../models/enums/timerecommended.enum';
import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
} from "../../../models/planThemes.model";

const themes: StructuredPlanDayProfile[] = [
  {
    id: 401,
    theme: PlanThemeEnum.BestOf,
    name: "Best of El Gotico",
    popular: true,
    barrioIds: [12],
    timeRecommendedOptions: [
      TimeRecommendedEnum.CoupleOfHours,
      TimeRecommendedEnum.HalfDay,
    ],
    requiresBookingOptions: [
      RequiresBookingEnum.No,
      RequiresBookingEnum.OnArrival,
    ],
    limit: 15,
    orderBy: [
      {
        key: "lng",
        direction: "ASC",
      },
    ],
  },
  {
    id: 402,
    theme: PlanThemeEnum.BestOf, // @todo change?
    name: "Get sporty in Barcelona",
    categoryIds: [12],
    placeIds: [36, 37, 6, 285, 158, 290],
    placeIdsChooseAmount: 3,
    daytrip: 0,
    limit: 4,
  },
];
export default themes;
