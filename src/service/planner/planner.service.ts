import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument } from "../../models/place.model";
import { PlanBuilderInput, StructuredPlanResponse } from "../../models/plan.model";
import { createRandomPlanHandler, createStructuredPlanHandler } from './functions';


export class PlannerService {

  static createRandomPlan = async (): Promise<StructuredPlanResponse | null> => createRandomPlanHandler();  
  static createStructuredPlan = async (input: PlanBuilderInput): Promise<StructuredPlanResponse | null> => createStructuredPlanHandler(input);  
  
}
