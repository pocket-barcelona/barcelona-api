import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";


export interface ResetPasswordInput {
  email: String;
  resetToken: String;
  resetTimestamp: Number;
}

export interface ResetPasswordDocument extends ResetPasswordInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const resetPasswordSchema = new dynamoose.Schema({
  email: {
    type: String,
    required: true,
    hashKey: true,
  },
  resetToken: {
    type: String,
    required: true,
  },
  resetTimestamp: {
    type: Number,
    required: true
  },
}, {
  // timestamps: true,
});

export const RESET_PASSWORD_TABLE_NAME = 'ResetPassword';
const ResetPasswordModel = dynamoose.model<ResetPasswordDocument>(RESET_PASSWORD_TABLE_NAME, resetPasswordSchema);

export default ResetPasswordModel;
