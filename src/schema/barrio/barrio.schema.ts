import { object, number, string, type TypeOf, date, optional } from "zod";

const params = {
  query: object({
    regionId: string().optional(),
  }),
};

export const readBarrioSchema = object({
  ...params,
});

export type ReadBarrioInput = TypeOf<typeof readBarrioSchema>;
