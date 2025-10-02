import { object, string, type TypeOf } from 'zod';

const params = {
	query: object({
		regionId: string().optional(),
	}),
};

export const readBarrioSchema = object({
	...params,
});

export type ReadBarrioInput = TypeOf<typeof readBarrioSchema>;
