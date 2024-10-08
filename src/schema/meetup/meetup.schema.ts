import {
  object,
  number,
  string,
  type TypeOf,
  boolean,
  enum as enum_,
} from "zod";

const createMeetupPayload = {
  body: object({
    groupId: string(),
    clonedId: string().optional(),
    eventConfig: object({
      minAttendees: number(),
      maxAttendees: number(),
      requiresMobileNumber: boolean().optional(),
      requiresIdentityCard: boolean().optional(),
      requiresEmailAddress: boolean().optional(),
      requiresQRCodeEntry: boolean().optional(),
      requiresVerifiedUser: boolean().optional(),
      eventLanguage: string().array().optional(),
    }),
    status: enum_(["PUBLISHED", "DRAFT", "ARCHIVED", "SOFTDELETED", "DELETED"]),
    privacy: number(),
    rsvpType: enum_(["DEFINITE", "INDEFINITE"]),
    title: string()
      .min(5, "Event title is required and must be at least 5 chars")
      .max(100, "Event title - too long!"),
    subtitle: string()
      .min(5, "Event subtitle must be at least 5 chars")
      .max(255, "Event subtitle - too long!")
      .optional(),
    description: string()
      .min(20, "Event description must be at least 20 chars")
      .max(4000, "Event description - too long! Max 4000 chars"),
    directions: string()
      .min(5, "Event directions must be at least 5 chars")
      .max(500, "Event directions - too long! Max 500 chars")
      .optional(),
    category: string(),
    subcategory: string().array(),
    mode: enum_(["IN_PERSON", "ONLINE", "HYBRID"]),
    // startTime: string(),
    // endTime: string(),
    startTime: number({
      invalid_type_error: "Event start time must be a number",
    }).min(Date.now(), "Event can't be in the past"),
    endTime: number({
      invalid_type_error: "Event end time must be a number",
    }).min(Date.now(), "Event can't be in the past"),
    location: object({
      address1: string(),
      address2: string(),
      postcode: string(),
      town: string(),
      province: string(),
      country: string(),
      notes: string(),
      lat: number(),
      lng: number(),
      locationPrecision: number(),
    }),
    price: object({
      priceCents: number(),
      currencyCode: string(),
      locale: string(),
      paymentScheme: string(),
      canUseCredit: boolean(),
    }),
    hosts: object({
      userId: string(),
      hostRole: string(),
      isOrganiser: boolean().optional()
    }).array(),
    tags: string().array(),

    // @todo - do as patch later
    // promoCodes: ...,
    // vouchers: unknown;
    // photos: ...,
  }),
};

const updateMeetupPayload = {
  body: object({
    ...createMeetupPayload.body.shape
  }),
  params: object({
    meetupId: string({
      required_error: "meetup ID is required",
    }),
  }),
};

const selectByIdParams = {
  params: object({
    meetupId: string({
      required_error: "meetup ID is required",
    }),
  }),
};

const selectByShortIdParams = {
  params: object({
    eventShortId: string({
      required_error: "short ID is required",
    }),
  }),
};

export const createMeetupSchema = object({
  ...createMeetupPayload,
});

export const updateMeetupSchema = object({
  ...updateMeetupPayload,
});

export const deleteMeetupSchema = object({
  ...selectByIdParams,
});

export const getMeetupByIdSchema = object({
  ...selectByIdParams,
});

export const getMeetupByShortIdSchema = object({
  ...selectByShortIdParams,
});

export type CreateMeetupInput = TypeOf<typeof createMeetupSchema>;
export type UpdateMeetupInput = TypeOf<typeof updateMeetupSchema>;
export type ReadMeetupByIdInput = TypeOf<typeof getMeetupByIdSchema>;
export type ReadMeetupByShortIdInput = TypeOf<typeof getMeetupByShortIdSchema>;
export type DeleteMeetupInput = TypeOf<typeof deleteMeetupSchema>;
