import type { Request, Response } from "express";
import type {
	CreateMeetupGroupInput,
	// DeleteMeetupGroupInput,
	UpdateMeetupGroupInput,
} from "../../schema/meetupGroup/meetupGroup.schema";
import {
	createMeetupGroup,
	// deleteMeetupGroup,
	getMeetupGroupById,
	getMeetupGroupsList,
	updateMeetupGroup,
} from "./handlers";

// biome-ignore lint/complexity/noStaticOnlyClass: N/A
export class MeetupGroupController {
	static createMeetupGroupHandler = (
		req: Request<unknown, unknown, CreateMeetupGroupInput["body"]>,
		res: Response,
	) => createMeetupGroup(req, res);

	static getMeetupGroupHandler = (
		req: Request<UpdateMeetupGroupInput["params"]>,
		res: Response,
	) => getMeetupGroupById(req, res); // user logged in!

	static getMeetupGroupListHandler = (req: Request, res: Response) =>
		getMeetupGroupsList(req, res);

	static updateMeetupGroupHandler = (
		req: Request<
			UpdateMeetupGroupInput["params"],
			unknown,
			UpdateMeetupGroupInput["body"]
		>,
		res: Response,
	) => updateMeetupGroup(req, res);

	// static deleteMeetupGroupHandler = (
	//   req: Request<
	//     DeleteMeetupGroupInput["params"],
	//     unknown,
	//     UpdateMeetupGroupInput["body"]
	//   >,
	//   res: Response
	// ) => deleteMeetupGroup(req, res);
}
