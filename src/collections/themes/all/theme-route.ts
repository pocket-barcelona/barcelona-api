import {
  StructuredPlanDayProfile,
  PlanThemeEnum,
} from "../../../models/planThemes.model";

const themes: StructuredPlanDayProfile[] = [
  {
    id: 701,
    theme: PlanThemeEnum.Route,
    name: "Discover Montjuic and The Castle",
    // barrioIds: [26],
    categoryIds: [],
    placeIds: [
      72, 246, 77, 78, 220, 135, 224, 221, 245, 222, 247, 71, 293, 292, 76, 149,
      73, 295, 294, 115, 244, 74, 75, 228, 146, 145, 242, 79, 10, 286,
    ],
    placeIdsAreOrdered: true,
    // more?
  },
];
export default themes;
