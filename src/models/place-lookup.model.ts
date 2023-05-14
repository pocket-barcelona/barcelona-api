import { PlaceDocument } from "./place.model";

export type PlaceLookupDocument = Pick<
  PlaceDocument,
  | "nameOfficial"
  | "placeId"
  // | "urlSlug"
>;
