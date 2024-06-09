import type { PlaceDocument } from "./place.model";

export type PlaceLookupDocument = Pick<
  PlaceDocument,
  | "labelCat"
  | "placeId"
>;
