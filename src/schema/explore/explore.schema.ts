import { object, number, string, array, TypeOf, boolean } from "zod";

// https://github.com/colinhacks/zod

// const payload = {
//   body: object({
//     // not needed at the moment...
//   }),
// };

const params = {
  body: object({
    provinceId: number({
      required_error: "At least one province ID is required",
      invalid_type_error: 'Expected array of numbers',
    }).array().optional(),
    barrioId: number({
      required_error: "At least one barrio ID is required",
      invalid_type_error: 'Expected array of numbers',
    }).array().optional(),
    categoryId: number({
      required_error: "At least one category ID is required",
      invalid_type_error: 'Expected array of numbers',
    }).array().optional(),
    town: string({
      required_error: "town is required",
      invalid_type_error: 'Expected string',
    }).optional(),
    keyword: string({
      required_error: "Keyword is required",
      // invalid_type_error
    }).optional(),
    price: number({
      required_error: "price is required",
      // invalid_type_error
    }).optional(),
    timeRecommended: number({
      required_error: "timeRecommended is required",
      // invalid_type_error
    }).optional(),
    bestTod: number({
      required_error: "bestTod is required",
      // invalid_type_error
    }).optional(),
    commitmentRequired: number({
      required_error: "commitmentRequired is required",
      // invalid_type_error
    }).optional(),
    childrenSuitability: number({
      required_error: "childrenSuitability is required",
      // invalid_type_error
    }).optional(),
    teenagerSuitability: number({
      required_error: "teenagerSuitability is required",
      // invalid_type_error
    }).optional(),
    requiresBooking: number({
      required_error: "requiresBooking is required",
      // invalid_type_error
    }).optional(),
    metroZone: number({
      required_error: "metroZone is required",
      // invalid_type_error
    }).optional(),
    popular: boolean({
      required_error: "popular is required",
      invalid_type_error: 'Expected boolean',
    }).optional(),
    seasonal: boolean({
      required_error: "seasonal is required",
      // invalid_type_error
    }).optional(),
    availableSundays: boolean({
      required_error: "availableSundays is required",
      // invalid_type_error
    }).optional(),
    daytrip: number({
      required_error: "daytrip is required",
      // invalid_type_error
    }).optional(),
    exclude: number({
      required_error: "exclude is required",
      // invalid_type_error
    }).array().optional(),
    include: number({
      required_error: "include is required",
      // invalid_type_error
    }).array().optional(),
    /** This is a lat/lng like: lat,lng */
    poi: string({
      required_error: "poi is required",
      // invalid_type_error
    }).optional(),
    orderBy: string({
      required_error: "orderBy is required",
      // invalid_type_error
    }).optional(),
    page: number({
      invalid_type_error: "Expected number",
    }).optional(),
  }),
};

export const exploreSchema = object({
  ...params,
});

export type ReadExploreInput = TypeOf<typeof exploreSchema>;
