import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";


export interface CategoryInput {
  /** Unique ID number for the category */
  categoryId: number;
  /** The label */
  label: string;
  slug: string;
  icon: string;
  poster: string;
  suitableFor: string;
}

export interface CategoryDocument extends CategoryInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new dynamoose.Schema({
  categoryId: {
    type: Number,
    required: true,
    hashKey: true,
  },
  label: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    default: '',
  },
  icon: {
    type: String,
    required: true,
    default: '',
  },
  poster: {
    type: String,
    required: true,
    default: '',
  },
  suitableFor: {
    type: String,
    required: true,
    default: '',
  },
}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME = 'Categories';
const CategoryModel = dynamoose.model<CategoryDocument>(TABLE_NAME, categorySchema);

export default CategoryModel;
