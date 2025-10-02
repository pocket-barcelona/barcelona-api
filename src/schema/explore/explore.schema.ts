import z from 'zod';

// https://github.com/colinhacks/zod

// const payload = {
//   body: z.object({
//     // not needed at the moment...
//   }),
// };

const params = {
	body: z.object({
		provinceId: z
			.number({
				required_error: 'At least one province ID is required',
				invalid_type_error: 'Expected array of numbers',
			})
			.array()
			.optional(),
		barrioId: z
			.number({
				required_error: 'At least one barrio ID is required',
				invalid_type_error: 'Expected array of numbers',
			})
			.array()
			.optional(),
		categoryId: z
			.number({
				required_error: 'At least one category ID is required',
				invalid_type_error: 'Expected array of numbers',
			})
			.array()
			.optional(),
		town: z
			.string({
				required_error: 'town is required',
				invalid_type_error: 'Expected string',
			})
			.optional(),
		keyword: z
			.string({
				required_error: 'Keyword is required',
				// invalid_type_error
			})
			.optional(),
		price: z
			.number({
				required_error: 'price is required',
				// invalid_type_error
			})
			.optional(),
		timeRecommended: z
			.number({
				required_error: 'timeRecommended is required',
				// invalid_type_error
			})
			.optional(),
		bestTod: z
			.number({
				required_error: 'bestTod is required',
				// invalid_type_error
			})
			.optional(),
		commitmentRequired: z
			.number({
				required_error: 'commitmentRequired is required',
				// invalid_type_error
			})
			.optional(),
		childrenSuitability: z
			.number({
				required_error: 'childrenSuitability is required',
				// invalid_type_error
			})
			.optional(),
		teenagerSuitability: z
			.number({
				required_error: 'teenagerSuitability is required',
				// invalid_type_error
			})
			.optional(),
		requiresBooking: z
			.number({
				required_error: 'requiresBooking is required',
				// invalid_type_error
			})
			.optional(),
		metroZone: z
			.number({
				required_error: 'metroZone is required',
				// invalid_type_error
			})
			.optional(),
		popular: z
			.boolean({
				required_error: 'popular is required',
				invalid_type_error: 'Expected boolean',
			})
			.optional(),
		seasonal: z
			.boolean({
				required_error: 'seasonal is required',
				// invalid_type_error
			})
			.optional(),
		availableSundays: z
			.boolean({
				required_error: 'availableSundays is required',
				// invalid_type_error
			})
			.optional(),
		daytrip: z
			.number({
				required_error: 'daytrip is required',
				// invalid_type_error
			})
			.optional(),
		exclude: z
			.number({
				required_error: 'exclude is required',
				// invalid_type_error
			})
			.array()
			.optional(),
		include: z
			.number({
				required_error: 'include is required',
				// invalid_type_error
			})
			.array()
			.optional(),
		tags: z
			.string({
				// invalid_type_error
			})
			.array()
			.optional(),
		/** This is a lat/lng like: lat,lng */
		poi: z
			.string({
				required_error: 'poi is required',
				// invalid_type_error
			})
			.optional(),
		orderBy: z
			.string({
				required_error: 'orderBy is required',
				// invalid_type_error
			})
			.optional(),
		page: z
			.number({
				invalid_type_error: 'Expected number',
			})
			.optional(),
		pageSize: z
			.number({
				invalid_type_error: 'Expected number',
			})
			.optional(),
	}),
};

export const exploreSchema = z.object({
	...params,
});

export type ReadExploreInput = z.TypeOf<typeof exploreSchema>;
