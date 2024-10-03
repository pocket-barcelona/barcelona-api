import {
  object,
  number,
  string,
  type TypeOf,
  boolean,
  enum as enum_,
} from "zod";

const createMeetupGroupPayload = {
  body: object({
    groupName: string()
      .min(5, "Group name is required and must be at least 5 chars")
      .max(64, "Group name is too long"),
    groupLocation: string()
      .min(2, "Group location is required and must be at least 2 chars")
      .max(100, "Group location is too long"),
    about: string()
      .min(20, "About description must be at least 20 chars")
      .max(4000, "About description is too long. Max 4000 chars"),
    // topics: string().array().optional(),
  }),
};

const updateMeetupGroupPayload = {
  body: object({
    groupName: string()
      .min(5, "Group name is required and must be at least 5 chars")
      .max(64, "Group name is too long"),
    groupLocation: string()
      .min(2, "Group location is required and must be at least 2 chars")
      .max(100, "Group location is too long"),
    about: string()
      .min(20, "About description must be at least 20 chars")
      .max(4000, "About description is too long. Max 4000 chars"),
  }),
  params: object({
    groupId: string({
      required_error: "group ID is required",
    }),
  }),
};

const selectByIdParams = {
  params: object({
    groupId: string({
      required_error: "group ID is required",
    }),
  }),
};


export const createMeetupGroupSchema = object({
  ...createMeetupGroupPayload,
});

export const updateMeetupGroupSchema = object({
  ...updateMeetupGroupPayload,
});

export const deleteMeetupGroupSchema = object({
  ...selectByIdParams,
});

export const getMeetupGroupByIdSchema = object({
  ...selectByIdParams,
});


export type CreateMeetupGroupInput = TypeOf<typeof createMeetupGroupSchema>;
export type UpdateMeetupGroupInput = TypeOf<typeof updateMeetupGroupSchema>;
export type ReadMeetupGroupByIdInput = TypeOf<typeof getMeetupGroupByIdSchema>;
export type DeleteMeetupGroupInput = TypeOf<typeof deleteMeetupGroupSchema>;
