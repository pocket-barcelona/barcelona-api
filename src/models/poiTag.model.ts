/**
 * Tags for POI = Points of Interest
 * Include:
 * */

import dynamoose from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item.js';

export interface PoiTagInput {
	/** The Tag ID */
	tagId: string;
	active: boolean;
	label: string;
	count: number;
}

export interface PoiTagDocument extends Item, PoiTagInput {
	createdAt: Date;
	updatedAt: Date;
}

const poiTagSchema = new dynamoose.Schema(
	{
		tagId: {
			type: String,
			required: true,
			hashKey: true,
		},
		active: {
			type: Boolean,
			required: true,
		},
		label: {
			type: String,
			required: true,
		},
		count: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
		saveUnknown: false,
	}
);

export const TABLE_NAME_POI_TAGS = 'PoiTags';
const PoiTagModel = dynamoose.model<PoiTagDocument>(TABLE_NAME_POI_TAGS, poiTagSchema);

export default PoiTagModel;
