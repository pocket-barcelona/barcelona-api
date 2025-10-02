import z from 'zod';

/**
 * @todo - these schemas need revising.
 * Currently they are not related to CRUD operations!
 *
 */
const payload = {
	body: z.object({
		profileType: z.number({
			required_error: 'Profile type is required',
			invalid_type_error: 'Must be a number',
		}),
		numberOfDays: z.number({
			required_error: 'Number of days is required',
			invalid_type_error: 'Must be a number',
		}),
		budget: z.number({
			required_error: 'Budget is required',
			invalid_type_error: 'Must be a number',
		}),
		// categoryIds: array({
		//   required_error: 'Budget is required',
		//   invalid_type_error: 'Must be a number'
		// })
	}),
};

const params = {
	params: z.object({
		planId: z.string({
			required_error: 'ID is required',
			// invalid_type_error
		}),
	}),
};

export const buildPlanSchema = z.object({
	...payload,
});

export const createPlanSchema = z.object({
	// TODO!
	// ...payload,
});

export const readPlanSchema = z.object({
	...params,
});

export const updatePlanSchema = z.object({
	...payload,
	...params,
});

export const deletePlanSchema = z.object({
	...params,
});

/** The schema for creating a new planned itinerary */
export type BuildPlanInput = z.TypeOf<typeof createPlanSchema>;

/** The schema for inserting a new plan template into DB */
export type CreatePlanInput = z.TypeOf<typeof createPlanSchema>;
export type ReadPlanInput = z.TypeOf<typeof readPlanSchema>;
export type UpdatePlanInput = z.TypeOf<typeof updatePlanSchema>;
export type DeletePlanInput = z.TypeOf<typeof deletePlanSchema>;
