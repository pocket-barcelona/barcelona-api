import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument } from "../../models/place.model";
import { PlanBuilderInput, StructuredPlan } from "../../models/plan.model";
import { createRandomPlanHandler, createStructuredPlanHandler } from './functions';


export class PlannerService {

  static createRandomPlan = async (): Promise<StructuredPlan | null> => createRandomPlanHandler();  
  static createStructuredPlan = async (input: PlanBuilderInput): Promise<StructuredPlan | null> => createStructuredPlanHandler(input);  
  
}
