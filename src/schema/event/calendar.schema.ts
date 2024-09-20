import { object, string, type TypeOf } from "zod";

const payload = {
  body: object({
    // not needed at the moment...
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "id is required",
      // invalid_type_error
    })
  }),
};

export const createCalendarEventSchema = object({
  ...payload,
});

export const readCalendarEventSchema = object({
  ...params,
});

export const updateCalendarEventSchema = object({
  ...payload,
  ...params,
});

export const deleteCalendarEventSchema = object({
  ...params,
});

export type CreateCalendarEventInput = TypeOf<typeof createCalendarEventSchema>;
export type ReadCalendarEventInput = TypeOf<typeof readCalendarEventSchema>;
export type UpdateCalendarEventInput = TypeOf<typeof updateCalendarEventSchema>;
export type DeleteCalendarEventInput = TypeOf<typeof deleteCalendarEventSchema>;
