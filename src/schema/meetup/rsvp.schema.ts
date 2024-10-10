import { object, number, string, type TypeOf } from "zod";


// TODO...

const payload = {
  body: object({
    // meetupId: string({
    //   required_error: "Meetup ID is required", // we need to know which response this event is for
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

const meetupIdParams = {
  params: object({
    meetupId: string({
      required_error: "meetup ID is required",
    }),
  }),
};

const rsvpIdParams = {
  params: object({
    meetupId: meetupIdParams.params.shape.meetupId,
    rsvpId: string({
      required_error: "rsvp ID is required",
    }),
  }),
};


export const createRsvpSchema = object({
  ...payload,
  ...meetupIdParams
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
