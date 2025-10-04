import type { ScanResponse } from 'dynamoose/dist/ItemRetriever.js';
import type { MeetupGroupDocument, MeetupGroupItem } from '../../models/meetupGroup.model.js';
import type {
	CreateMeetupGroupInput,
	UpdateMeetupGroupInput,
} from '../../schema/meetupGroup/meetupGroup.schema.js';
import {
	createHandler,
	getByIdHandler,
	getListHandler,
	updateHandler,
	// deleteByIdHandler,
} from './functions/index.js';

// biome-ignore lint/complexity/noStaticOnlyClass: WIP
export class MeetupGroupService {
	static create = async (
		input: CreateMeetupGroupInput['body'],
		ownerId: string
	): Promise<MeetupGroupDocument | null | string> => createHandler(input, ownerId);

	static getMeetupGroups = async (
		ownerId?: MeetupGroupDocument['ownerId']
	): Promise<ScanResponse<MeetupGroupDocument> | null> => getListHandler(ownerId);

	static getById = async (
		input: Pick<MeetupGroupItem, 'groupId'> & { loggedIn?: boolean }
	): Promise<MeetupGroupDocument | Partial<MeetupGroupDocument> | null> => getByIdHandler(input);

	static update = async (
		groupId: MeetupGroupItem['groupId'],
		input: UpdateMeetupGroupInput['body']
	): Promise<MeetupGroupDocument | null> => updateHandler(groupId, input);

	// static deleteById = async (
	//   theEvent: MeetupGroupDocument,
	//   newStatus: MeetupGroupStatusEnum
	// ): Promise<string | null | undefined> =>
	//   deleteByIdHandler(theEvent, newStatus);
}
