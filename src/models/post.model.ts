import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { CategoryDocument } from './category.model';


export enum PostStatusEnum {
  Draft = 'draft',
  Active = 'active',
}
export interface PostStatus {
  id: PostStatusEnum;
  /** This is the label */
  status: string;
}

export enum PostVisibilityEnum {
  Web = "web",
  App = "app",
  All = "all",
}

export interface PostTypeModel {
  typeId: string;
  typeName: string;
}
export interface PostAuthorModel {
  authorId: string;
  authorName: string;
  // authorAvatar?: string;
}

export interface PostImage {
  imageId: string;
  imageUrl: string;
  imageAlt: string;
}

type ID = string;
export interface PostInput {
  /** The post ID, like UUID */
  postId: ID;
  /** Allows post to be draft (active but hidden), active... */
  status: PostStatusEnum | string;
  /** Allows post to be on the app only, website only or all */
  visibility: PostVisibilityEnum | string;
  /** Main post title, like "How To Visit Mount Tibidabo" */
  title: string;
  /** Post subtitle, like "Amazing view of the iconic Barcelona skyline" */
  subtitle: string;
  /** The blog post's category for main taxonomy on the blog */
  categoryId: string;
  /** Post type ID - like "Best of...", "Guide to...", "Review of...", "How to..." */
  postTypeId: PostTypeModel["typeId"];
  /** Comma-separated list of tags, like "tibidabo,mirador,walking" */
  tags: string;
  /** Like my-guide-to-parc-guell */
  urlSlug: string;
  /** The ID of the person who wrote the post */
  authorId: PostAuthorModel["authorId"];
  /** Allow sharing of the post? */
  allowSharing: boolean;
  /** Allow post comments? */
  allowComments: boolean;
  /** User specified published date - date picker */
  published: string;
  /** The main content */
  content: string;
  /** Short summary for the post, without formatting */
  summary: string;
  /** @todo - The images for the post */
  postImages: PostImage[];
  /** Drop down for province, where the post is based */
  provinceId: number;
  /** Optional related barrio ID - allows for finding posts by neighbourhood */
  barrioId?: number;
  /** Optional latitude, for location aware posts in feed */
  lat?: number;
  /** Optional longitude, for location aware posts in feed */
  lng?: number;
  /** Optional: The ID of a related place */
  relatedPlaceId?: number;
  /** Allows more than 1 related post */
  relatedPostId?: ID;
  /** The related website category ID */
  relatedCategoryId?: CategoryDocument['categoryId'];
  // /** Meta data - created */
  // created: string;
  // /** Meta data - updated */
  // updated: string;
  /** Open Graph sharing data: title */
  ogTitle: string;
  /** Open Graph sharing data: desc */
  ogDescription: string;
  /** Open Graph sharing data: image */
  ogImage: string;
}


export interface PostDocument extends PostInput, Document {
  createdAt: Date;
  updatedAt: Date;
}


const postSchema = new dynamoose.Schema({
  postId: {
    type: String,
    required: true,
    hashKey: true,
  },
  status: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  /** This is the post category, not the website category! */
  categoryId: {
    type: String,
    required: true,
  },
  postTypeId: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  urlSlug: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  allowSharing: {
    type: Boolean,
    required: true,
  },
  allowComments: {
    type: Boolean,
    required: true,
  },
  published: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  postImages: {
    type: Array,
    // required: true,
    schema: [
      {
        type: Object,
        schema: {
          imageId: {
            type: String,
            required: true,
          },
          imageUrl: {
            type: String,
            required: true,
          },
          imageName: {
            type: String,
            required: true,
          },
          imageTitle: {
            type: String,
            required: true,
          },
          imageAlt: {
            type: String,
            required: true,
          },
        },
      }
    ],
  },
  provinceId: {
    type: Number,
    required: true,
  },
  barrioId: {
    type: Number,
    required: false,
  },
  lat: {
    type: Number,
    required: false,
  },
  lng: {
    type: Number,
    required: false,
  },
  relatedPlaceId: {
    type: Number,
    required: false,
  },
  relatedPostId: {
    type: String,
    required: false,
  },
  relatedCategoryId: {
    type: Number,
    required: false,
  },
  ogTitle: {
    type: String,
    required: true,
  },
  ogDescription: {
    type: String,
    required: true,
  },
  ogImage: {
    type: String,
    required: true,
  },

}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME_EVENTS = 'Posts';
const PostModel = dynamoose.model<PostDocument>(TABLE_NAME_EVENTS, postSchema);

export default PostModel;
