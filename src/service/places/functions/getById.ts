import PlaceModel, { type PlaceDocument } from "../../../models/place.model";

/**
 * Get a place by ID
 * @returns
 */
export default async function (
  placeId: PlaceDocument['placeId'],
): Promise<PlaceDocument | null> {
  try {
    // const activeField: keyof PlaceDocument = "active";
    const result = PlaceModel.get(placeId);
    
    return await result.catch((err) => {
      // logger.warn(err)
      return null;
    });
  } catch (e) {
    return null;
  }
}
