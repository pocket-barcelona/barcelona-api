import { object, number, string, TypeOf, date } from "zod";

const payload = {
  body: object({
    //
  }),
};

/** Filter the poi's by location etc */
const filterByParams = {
  params: object({
    lat: number({
      required_error: "lat is required",
      // invalid_type_error
    }),
    lng: number({
      required_error: "lng is required",
      // invalid_type_error
    }),
  }),
};

const params = {
  params: object({
    poiId: string({
      required_error: "ID is required",
      // invalid_type_error
    }),
  }),
};

export const filterByPoiSchema = object({
  ...filterByParams,
});

export const createPoiSchema = object({
  ...payload,
});

export const readPoiSchema = object({
  ...params,
});
  
// @todo
export const updatePoiSchema = object({
  ...payload,
  ...params,
});

export const deletePoiSchema = object({
  ...params,
});

export type FilterByPoiInput = TypeOf<typeof filterByPoiSchema>;
export type CreatePoiInput = TypeOf<typeof createPoiSchema>;
export type ReadPoiInput = TypeOf<typeof readPoiSchema>;
export type UpdatePoiInput = TypeOf<typeof updatePoiSchema>;
export type DeletePoiInput = TypeOf<typeof deletePoiSchema>;
