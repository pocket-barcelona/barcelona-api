import type { Request, Response } from "express";
import type {
  DeleteMeetupInput,
  UpdateMeetupInput,
} from "../../../schema/meetup/meetup.schema";
import { error, success } from "../../../middleware/apiResponse";
import {
  type MeetupDocument,
  MeetupStatusEnum,
} from "../../../models/meetup.model";
import { StatusCodes } from "http-status-codes"; // https://www.npmjs.com/package/http-status-codes
import { MeetupService } from "../../../service/meetup/meetup.service";

export default async function deleteDocument(
  req: Request<DeleteMeetupInput["params"], unknown, UpdateMeetupInput["body"]>,
  res: Response
) {
  // performHardDelete: boolean = false,
  // if (performHardDelete) {
  //   // check if user is allowed to do this!
  //   // res.locals.user
  // }

  // check if the document exists
  const documentId = req.params.eventId;
  const theDocument = await MeetupService.getById({
    id: documentId,
  });

  if (!theDocument) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .send(
        error(
          "The document cannot be deleted because it doesn't exist",
          res.statusCode
        )
      );
  }

  // @todo - make sure only the host can delete the document and not everybody

  let affectedDocument: string | null | undefined;

  // check the delete-able status of the document
  // can only delete certain types of documents
  switch (theDocument.status) {
    case MeetupStatusEnum.Published:
    case MeetupStatusEnum.Archived:
    case MeetupStatusEnum.Draft: {
      affectedDocument = await MeetupService.deleteById(
        theDocument as MeetupDocument,
        MeetupStatusEnum.SoftDeleted
      );

      if (typeof affectedDocument === "string") {
        return res
          .status(StatusCodes.NOT_FOUND)
          .send(
            error(
              "The document cannot be deleted because it doesn't exist",
              res.statusCode
            )
          );
      }
      if (affectedDocument === null) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .send(
            error("An error occurred while deleting the document", res.statusCode)
          );
      }
      return res.send(
        success<boolean>(true, {
          statusCode: res.statusCode,
        })
      );
    }

    case MeetupStatusEnum.SoftDeleted: {
      return res
        .status(StatusCodes.NOT_FOUND)
        .send(error("The document has already been deleted", res.statusCode));
    }

    default: {
      // affectedDocument = await MeetupService.deleteById(theDocument, MeetupStatusEnum.Deleted)

      return res
        .status(StatusCodes.NOT_FOUND)
        .send(error("The document does not exist", res.statusCode));
    }
  }
}
