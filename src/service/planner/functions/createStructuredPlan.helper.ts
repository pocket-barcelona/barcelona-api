import { planThemes, StructuredPlanDayProfile } from "../../../models/planThemes.model";

class PlanHelpers {
  getDayProfile(numberOfDays: number): StructuredPlanDayProfile {
    return planThemes.location[0];
  }
}