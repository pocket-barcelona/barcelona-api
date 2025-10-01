import type { PlanBuilderInput, StructuredPlanResponse } from '../../models/plan.model.js';
import { createRandomPlanHandler, createStructuredPlanHandler } from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: OK
export class PlannerService {
	static createRandomPlan = async (): Promise<StructuredPlanResponse | null> =>
		createRandomPlanHandler();
	static createStructuredPlan = async (
		input: PlanBuilderInput
	): Promise<StructuredPlanResponse | null> => createStructuredPlanHandler(input);
}
