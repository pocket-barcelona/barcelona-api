import type { PlanBuilderInput, StructuredPlanResponse } from "../../models/plan.model";
import { createRandomPlanHandler, createStructuredPlanHandler } from './functions';


// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PlannerService {

  static createRandomPlan = async (): Promise<StructuredPlanResponse | null> => createRandomPlanHandler();  
  static createStructuredPlan = async (input: PlanBuilderInput): Promise<StructuredPlanResponse | null> => createStructuredPlanHandler(input);  
  
}
