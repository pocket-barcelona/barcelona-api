import { object, number, string, TypeOf, date } from "zod";

const payload = {
  body: object({
    // not needed at the moment...
  }),
};

const params = {
  params: object({
    placeId: string({
      required_error: "ID is required",
      // invalid_type_error
    }),
  }),
};

export const createPlaceSchema = object({
  ...payload,
});

export const readPlaceSchema = object({
  ...params,
});

export const updatePlaceSchema = object({
  ...payload,
  ...params,
});

export const deletePlaceSchema = object({
  ...params,
});

export type CreatePlaceInput = TypeOf<typeof createPlaceSchema>;
export type ReadPlaceInput = TypeOf<typeof readPlaceSchema>;
export type UpdatePlaceInput = TypeOf<typeof updatePlaceSchema>;
export type DeletePlaceInput = TypeOf<typeof deletePlaceSchema>;
