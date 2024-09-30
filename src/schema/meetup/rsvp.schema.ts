import { object, number, string, type TypeOf } from "zod";


// TODO...

const payload = {
  body: object({
    // eventId: string({
    //   required_error: "Event ID is required", // we need to know which response this event is for
    // }),
    // attendeeUserId: string({
    //   required_error: "An attendeeUserId is required for this response",
    // }),
    attendanceStatus: number({
      required_error: "Attendance status is required",
    }),
    attendeeName: string({
      required_error: "Attendee Name is required",
    }),
    attendeeAvatarColor: string({
      required_error: "Attendee avatar color is required",
    }),
    comment: string({
      required_error: "Comment is required",
    }),
    pollAnswers: object({
      questionId: string(),
      answers: string().array()
    }).array().optional()
  }),
};

const eventIdParams = {
  params: object({
    eventId: string({
      required_error: "event ID is required",
    }),
  }),
};

const rsvpIdParams = {
  params: object({
    eventId: eventIdParams.params.shape.eventId,
    responseId: string({
      required_error: "response ID is required",
    }),
  }),
};


export const createRsvpSchema = object({
  ...payload,
  ...eventIdParams
});

export const updateRsvpSchema = object({
  ...payload,
  ...rsvpIdParams,
});

export const deleteRsvpSchema = object({
  ...rsvpIdParams,
});

export const getRsvpSchema = object({
  ...rsvpIdParams,
});

export type CreateRsvpInput = TypeOf<typeof createRsvpSchema>;
export type UpdateRsvpInput = TypeOf<typeof updateRsvpSchema>;
export type ReadRsvpInput = TypeOf<typeof getRsvpSchema>;
export type DeleteRsvpInput = TypeOf<typeof deleteRsvpSchema>;
