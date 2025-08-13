import { v4 as uuidv4 } from 'uuid';
import { MeetupService } from '../service/meetup/meetup.service.js';

const eventExists = async (shortId: string) => {
	const event = await MeetupService.getByShortId({ shortId });
	if (event?.meetupId) {
		return true;
	}
	return false;
};

const generateId = () => {
	const uuidFlat = uuidv4().replace(/-/g, '');
	const idChunks = uuidFlat.match(/.{1,7}/g) as Array<string>;
	return idChunks.reduce((acc, chunk) => {
		const index = Math.floor(Math.random() * 5);
		const char = chunk[index];
		return `${acc}${char ?? ''}`;
	}, '');
};

export default async function generateShortId(): Promise<string> {
	let shortId = generateId();
	while (await eventExists(shortId)) {
		shortId = generateId();
	}
	return shortId;
}
