import z from 'zod';

const payload = {
	body: z.object({
		// not needed at the moment...
	}),
};

const params = {
	params: z.object({
		placeId: z.string({
			required_error: 'ID is required',
			// invalid_type_error
		}),
	}),
};

export const createPlaceSchema = z.object({
	...payload,
});

export const readPlaceSchema = z.object({
	...params,
});

export const updatePlaceSchema = z.object({
	...payload,
	...params,
});

export const deletePlaceSchema = z.object({
	...params,
});

export type CreatePlaceInput = z.TypeOf<typeof createPlaceSchema>;
export type ReadPlaceInput = z.TypeOf<typeof readPlaceSchema>;
export type UpdatePlaceInput = z.TypeOf<typeof updatePlaceSchema>;
export type DeletePlaceInput = z.TypeOf<typeof deletePlaceSchema>;
