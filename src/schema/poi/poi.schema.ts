import z from 'zod';

const payload = {
	body: z.object({
		//
	}),
};

/** Filter the poi's by location, tag etc */
const filterByParams = {
	body: z.object({
		lat: z.optional(
			z.number({
				required_error: 'lat is required',
				// invalid_type_error
			})
		),
		lng: z.optional(
			z.number({
				required_error: 'lng is required',
				// invalid_type_error
			})
		),
		price: z.optional(
			z.number({
				required_error: 'price is required',
			})
		),
		barrioId: z
			.array(
				z.number({
					required_error: 'barrioId needs to be an array and is required',
				})
			)
			.min(1),
		tagId: z.array(z.string()).optional(),
	}),
};

const params = {
	params: z.object({
		poiId: z.string({
			required_error: 'ID is required',
			// invalid_type_error
		}),
	}),
};

export const filterByPoiSchema = z.object({
	...filterByParams,
});

export const createPoiSchema = z.object({
	...payload,
});

export const readPoiSchema = z.object({
	...params,
});

// @todo
export const updatePoiSchema = z.object({
	...payload,
	...params,
});

export const deletePoiSchema = z.object({
	...params,
});

export type FilterByPoiInput = z.TypeOf<typeof filterByPoiSchema>;
export type CreatePoiInput = z.TypeOf<typeof createPoiSchema>;
export type ReadPoiInput = z.TypeOf<typeof readPoiSchema>;
export type UpdatePoiInput = z.TypeOf<typeof updatePoiSchema>;
export type DeletePoiInput = z.TypeOf<typeof deletePoiSchema>;
