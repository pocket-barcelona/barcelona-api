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
    topics: string().array(),
    refundPolicy: string()
      .min(20, "Refund policy must be at least 20 chars")
      .max(4000, "Refund policy is too long. Max 4000 chars"),
    social: object({
      facebook: string(),
      instagram: string(),
      linkedin: string(),
      telegram: string(),
      tiktok: string(),
      twitter: string(),
      website: string(),
      whatsapp: string(),
      youtube: string(),
    }),
    // topics: string().array().optional(),
  }),
  params: object({
    groupId: string({
      required_error: "group ID is required",
    }),
  }),
};

const updateProfilePhotoPayload = object({
  body: object({
    profilePhoto: object({
      id: string(),
      url: string(),
      alt: string(),
      mediaType: string(),
      featured: boolean().optional(),
      createdTime: number()
    }),
  }),
  params: object({
    groupId: string({
      required_error: "group ID is required",
    }),
  }),
})

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
export type UpdateMeetupGroupPhotosInput = TypeOf<typeof updateProfilePhotoPayload>;
export type ReadMeetupGroupByIdInput = TypeOf<typeof getMeetupGroupByIdSchema>;
export type DeleteMeetupGroupInput = TypeOf<typeof deleteMeetupGroupSchema>;
