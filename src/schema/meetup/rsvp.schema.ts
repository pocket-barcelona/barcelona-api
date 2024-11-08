import { object, number, string, type TypeOf, boolean } from "zod";


const payload = {
  body: object({
    response: number({ // coming or not
      required_error: "Response status is required",
    }),
    // ticketType: number({
    //   required_error: "Ticket type is required",
    // }),
    guests: object({
      isMainGuest: boolean({
        required_error: "isMainGuest is required",
      }),
      name: string({
        required_error: "Attendee Name is required",
      }),
      avatar: string({
        required_error: "Attendee avatar color is required",
      }),
      lastname: string().optional(),
      mobile: string().optional(),
      comment: string().max(512, "Comment is too long.").optional(),
    }).array(),
    // pollAnswers: object({
    //   questionId: string(),
    //   answers: string().array()
    // }).array().optional()
  }),
};

const meetupIdParams = {
  params: object({
    meetupId: string({
      required_error: "Meetup ID is required",
    }),
  }),
};

const rsvpIdParams = {
  params: object({
    meetupId: meetupIdParams.params.shape.meetupId,
    rsvpId: string({
      required_error: "RSVP ID is required",
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
