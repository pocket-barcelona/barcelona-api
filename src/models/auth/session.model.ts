import * as dynamoose from "dynamoose";
import { UserDocument } from "./user.model";
import { Document } from "dynamoose/dist/Document";

export interface SessionTokenModel {
  accessToken: string;
  refreshToken: string;
}
export interface SessionExpiry {
  /** The moment that the session was created */
  iat: number;
  /** The future expiry timestamp of the session */
  exp: number;
}

export interface SessionDocument extends Document {
  // user: UserDocument["_id"];
  // id: string;
  // user: string;
  user: UserDocument['email']
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @link https://dynamoosejs.com/guide/Schema
 */
const sessionSchema = new dynamoose.Schema({
  // id: {
  //   type: String,
  //   hashKey: true,
  // },
  user: {
    required: true,
    // type: UserDocument['id'],
    type: String, // UserDocument['id']
    // type: dynamoose.Schema.attributeTypes.findDynamoDBType()
    hashKey: true,
  },
  valid: {
    type: Boolean,
    default: true,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  },
});

const SessionModel = dynamoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;

// example
// const MySession = new SessionModel({
//   'id': 123, 
//   'name': 'John Smith',
// })


// export interface SessionDocument extends mongoose.Document {
//   user: UserDocument["_id"];
//   valid: boolean;
//   userAgent: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const sessionSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     valid: { type: Boolean, default: true },
//     userAgent: { type: String },
//   },
//   {
//     timestamps: true,
//   }
// );

// const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

// export default SessionModel;
