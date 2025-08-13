import { convert } from 'url-slug';
import { v4 as uuidv4 } from 'uuid';
import type { MeetupGroupDocument, MeetupGroupItem } from '../../../models/meetupGroup.model.js';
import MeetupGroupModel from '../../../models/meetupGroup.model.js';
import type { CreateMeetupGroupInput } from '../../../schema/meetupGroup/meetupGroup.schema.js';

export default async function create(
	input: CreateMeetupGroupInput['body'],
	ownerId: string
): Promise<MeetupGroupDocument | null | string> {
	const slugName = convert(input.groupName);
	const slug = `${slugName}-${uuidv4().replace('-', '').slice(0, 8)}`;

	const { about, groupName, groupLocation } = input;
	try {
		const newGroup: MeetupGroupItem = {
			groupId: uuidv4(), // auto-generate for the group
			slug,
			ownerId,
			apiKey: uuidv4(), // auto-generate for the group
			about,
			refundPolicy: '',
			groupName,
			groupLocation,
			isVerified: false,
			isPublic: true,
			meetupIds: [],
			logo: [],
			profilePhoto: [],
			topics: [],
			signupDate: new Date(),
			lastLogin: new Date(),
			timezone: 'Europe/Madrid',
			social: {
				facebook: '',
				instagram: '',
				linkedin: '',
				telegram: '',
				tiktok: '',
				twitter: '',
				website: '',
				whatsapp: '',
				youtube: '',
				bizum: '',
			},
		};

		const result = await MeetupGroupModel.create(newGroup).catch((err) => {
			if (err?.message) return err.message;
			return null;
		});

		return result;
	} catch (err: unknown) {
		// post values were malformed
		return null;
	}
}
