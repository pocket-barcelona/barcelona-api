import PlaceModel, { PlaceDocument } from "../../../models/place.model";
import { Query, ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { StructuredPlanResponse, structuredPlanObj } from "../../../models/plan.model";

/**
 * Generate a random plan for 1 day
 * @returns
 */
export default async function (): Promise<StructuredPlanResponse | null> {
  try {
    // TODO
    // const result = PlaceModel.get(1);
    return structuredPlanObj;

    // return await result.catch((err) => {
    //   // logger.warn(err)
    //   return null;
    // });
  } catch (e) {
    return null;
  }
}
