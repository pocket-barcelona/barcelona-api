import z from 'zod';

/**
 * @todo - these schemas need revising.
 * Currently they are not related to CRUD operations!
 *
 */
const payload = {
	body: z.object({
		numberOfDays: z.number().min(1).max(5),
		// OPTIONALS
		budget: z.number().min(0).max(32).optional(),
		categoryIds: z.array(z.number()).min(1).optional(),
		includePlacesOutsideBarcelona: z.boolean().optional(),
		walkBetweenPlacesEnabled: z.boolean().optional(),
		timeRecommended: z.number().min(0).max(64).optional(),
		preferredTimeOfDay: z.number().min(0).max(16).optional(),
		centralBarriosOnly: z.number().optional(),
		barrioIds: z.array(z.number()).optional(),
		includePlaceIds: z.array(z.number()).min(1).optional(),
		excludePlaceIds: z.array(z.number()).min(1).optional(),
		visitingWithPets: z.boolean().optional(),
		visitingWithKids: z.boolean().optional(),
		visitingWithTeenagers: z.boolean().optional(),
		includeFoodSuggestions: z.boolean().optional(),
		includeDrinkSuggestions: z.boolean().optional(),
		includeNightclubSuggestions: z.boolean().optional(),
		travelDates: z
			.object({
				from: z.number(),
				to: z.number(),
			})
			.optional(),
		includeEventRemarks: z.boolean().optional(),
		bookingRemarks: z.boolean().optional(),
		homeCentrePoint: z
			.string()
			.min(3)
			.refine((val) => val?.includes(','))
			.refine((val) => val?.includes('.'))
			.optional(), // like "41.123,2.456"
		preferPlacesNearTheSea: z.boolean().optional(),
		hasCar: z.boolean().optional(),
		addressContains: z.string().optional(),
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

/** This is for building a plan on the fly */
export const buildPlanSchema = z.object({
	...payload,
});

/** This is for Crud...! */
export const createPlanSchema = z.object({
	...payload,
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
export type BuildPlanInput = z.TypeOf<typeof buildPlanSchema>;

/** The schema for inserting a new plan template into DB */
export type CreatePlanInput = z.TypeOf<typeof createPlanSchema>;
export type ReadPlanInput = z.TypeOf<typeof readPlanSchema>;
export type UpdatePlanInput = z.TypeOf<typeof updatePlanSchema>;
export type DeletePlanInput = z.TypeOf<typeof deletePlanSchema>;
