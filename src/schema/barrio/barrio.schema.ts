import z from 'zod';

const params = {
	query: z
		.object({
			regionId: z.string().optional(),
		})
		.optional(),
};

export const readBarrioSchema = z.object({
	...params,
});

export type ReadBarrioInput = z.TypeOf<typeof readBarrioSchema>;
