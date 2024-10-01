import dynamoose from "dynamoose";

export const genericMediaAssetSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
    saveUnknown: false,
  }
);


// Additional types...

export type ImageAssetsSize = "thumb" | "small" | "medium" | "large" | "xlarge";
export interface ImageAssets {
  size: ImageAssetsSize;
  url: string;
}

export type GenericMediaItem = {
  id: string;
  url: string;
  alt: string;
  mediaType: "IMAGE" | "VIDEO";
  featured?: boolean;
  createdTime: string;
};
