import { object, number, string, TypeOf, date, array } from "zod";

const payload = {
  body: object({
    profileType: number({
      required_error: 'Profile type is required',
      invalid_type_error: 'Must be a number'
    }),
    numberOfDays: number({
      required_error: 'Number of days is required',
      invalid_type_error: 'Must be a number'
    }),
    budget: number({
      required_error: 'Budget is required',
      invalid_type_error: 'Must be a number'
    }),
    // categoryIds: array({
    //   required_error: 'Budget is required',
    //   invalid_type_error: 'Must be a number'
    // })

  }),
};


const params = {
  params: object({
    planId: string({
      required_error: "ID is required",
      // invalid_type_error
    }),
  }),
};

export const createPlanSchema = object({
  ...payload,
});

export const readPlanSchema = object({
    ...params,
  });
  

export const updatePlanSchema = object({
  ...payload,
  ...params,
});

export const deletePlanSchema = object({
  ...params,
});

export type CreatePlanInput = TypeOf<typeof createPlanSchema>;
export type ReadPlanInput = TypeOf<typeof readPlanSchema>;
export type UpdatePlanInput = TypeOf<typeof updatePlanSchema>;
export type DeletePlanInput = TypeOf<typeof deletePlanSchema>;
