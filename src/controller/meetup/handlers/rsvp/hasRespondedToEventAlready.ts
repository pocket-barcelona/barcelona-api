import type { Request, Response } from "express";
import { error, success } from "../../../../middleware/apiResponse";
import type { MeetupDocument } from "../../../../models/meetup.model";
import type { CreateResponseInput } from "../../../../schema/meetup/rsvp.schema";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import type { UserDocument } from "../../../../models/auth/user.model";
import { ResponseService } from "../../../../service/rsvp/response.service";

/**
 * Check if user has responded to this event or not yet
 * Note: User could be logged in or not!
 * @param req
 * @param res
 */
export default async function hasRespondedToEventAlready(
  req: Request<
    CreateResponseInput["params"],
    never,
    {
      responseId: string;
    }
  >,
  res: Response
) {
  // get event from middleware locals
  const theEvent = res.locals.event as MeetupDocument;

  const { responseId } = req.body;

  // check if the user is logged in, manually
  // responses can be from not-logged in users, so allow user ID to not exist
  // @todo - make a middleware for this if needed again?
  let userId = "";
  if (res.locals?.user?.userId) {
    const theUserId = (res.locals.user as UserDocument).userId.toString();
    if (theUserId) {
      userId = theUserId;
    }
  }

  const matchedResponseId = await ResponseService.hasRespondedToEventYet(
    theEvent,
    userId,
    responseId
  );

  return res.send(
    success<{
      responseId: string | null;
    }>(
      {
        responseId: matchedResponseId ? matchedResponseId : null,
      },
      {
        statusCode: res.statusCode,
      }
    )
  );
}
