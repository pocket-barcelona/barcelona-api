import { PlaceDocument } from "./place.model";

export type PlaceSearchDocument = Pick<
  PlaceDocument,
  | "nameOfficial"
  | "nameEnglish"
  | "nameOfficialAccentless"
  | "description"
  | "placeId"
  | "urlSlug"
  | "tags"
  | "barrioId"
>;
