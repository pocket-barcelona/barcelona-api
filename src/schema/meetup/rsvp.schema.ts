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

const responseIdParams = {
  params: object({
    eventId: eventIdParams.params.shape.eventId,
    responseId: string({
      required_error: "response ID is required",
    }),
  }),
};


export const createResponseSchema = object({
  ...payload,
  ...eventIdParams
});

export const updateResponseSchema = object({
  ...payload,
  ...responseIdParams,
});

export const deleteResponseSchema = object({
  ...responseIdParams,
});

export const getResponseSchema = object({
  ...responseIdParams,
});

export type CreateResponseInput = TypeOf<typeof createResponseSchema>;
export type UpdateResponseInput = TypeOf<typeof updateResponseSchema>;
export type ReadResponseInput = TypeOf<typeof getResponseSchema>;
export type DeleteResponseInput = TypeOf<typeof deleteResponseSchema>;
