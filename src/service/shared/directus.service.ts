import { aggregate, createDirectus, readItems, rest } from '@directus/sdk';
import { config } from '../../config.js';
import type { CalendarEventDirectus } from '../../models/calendar.type.js';

type HeadlessSchema = {
	events: CalendarEventDirectus[];
};

const directus = createDirectus<HeadlessSchema>(config.HEADLESS_STUB).with(
	rest({
		onRequest: (options) => ({ ...options, cache: 'no-store' }),
	})
);

class DirectusService {
	public async getItems<T extends keyof HeadlessSchema>(schema: T, page: number, limit: number) {
		return await directus.request(
			readItems(schema, {
				limit,
				page,
			})
		);
	}

	public async getTotalItemCount<T extends keyof HeadlessSchema>(schema: T): Promise<number> {
		const totalCount = await directus.request(
			aggregate(schema, {
				aggregate: { count: '*' },
			})
		);
		const totalItems = totalCount[0].count;
		return Number(totalItems ?? 0);
	}

	public async getAllDirectusItems<T extends keyof HeadlessSchema, TDirectusItemSchema>(
		schema: T
	): Promise<TDirectusItemSchema[]> {
		const directusPaginationLimit = 100; // Directus page limit
		const totalItemsCount = await this.getTotalItemCount(schema);
		const totalPages = Math.ceil(totalItemsCount / directusPaginationLimit); // directus pagination
		const allItems: TDirectusItemSchema[] = [];
		for (let page = 1; page <= totalPages; page++) {
			const items = await this.getItems<T>(schema, page, directusPaginationLimit);
			allItems.push(...(items as TDirectusItemSchema[]));
		}
		return allItems;
	}
}

export default new DirectusService();
