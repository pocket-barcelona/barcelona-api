import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import { UserUtils } from '../../service/user/user.utils';

/** What the user must provide to create their user account */
export interface UserInput {
  email: string;
  name: string;
  password: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  avatarColor?: string;
}
export enum UserEmailConfirmedEnum {
  Unconfirmed = 0,
  Confirmed = 1,
}
export enum UserStatusEnum {
  Active = 1,
  Disabled = 2,
  Deleted = 3,
}
export enum CheckResetTokenEnum {
  NoDocument = 1,
  TokenMismatch = 2,
  TokenExpired = 3,
  TokenValid = 4,
}

export interface UserDocument extends UserInput, Item {
  /** Newly registered users are 0 (unconfirmed). After clicking email link, become confirmed */
  emailConfirmed: UserEmailConfirmedEnum;
  /** User active status */
  userStatus: UserStatusEnum;
  
  /** Where the signup came from - for marketing campaigns */
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  avatarColor: string;

  /** An auto-generated uuid for the user */
  userId: string;
  /**
   * DynamoDB handles created/updated timestamps. See https://dynamoosejs.com/guide/Schema/#required-boolean
   */
  createdAt: Date;
  /**
   * DynamoDB handles created/updated timestamps. See https://dynamoosejs.com/guide/Schema/#required-boolean
   */
  updatedAt: Date;
  /**
   * @todo - attach an accessory method to the document model to handle bcrypt password comparing
   * @param candidatePassword 
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new dynamoose.Schema({
  email: {
    type: String,
    required: true,
    hashKey: true,
    // index: true, // this throws an error in getUserById() !
  },
  userId: {
    type: String,
    required: false,
    
    // default: uuidv4(),
    // index: true,
  },
  userStatus: {
    type: Number,
    required: false,
    enum: [UserStatusEnum.Active, UserStatusEnum.Disabled, UserStatusEnum.Deleted],
    default: UserStatusEnum.Active,
  },
  emailConfirmed: {
    type: Number,
    required: false,
    enum: [UserEmailConfirmedEnum.Unconfirmed, UserEmailConfirmedEnum.Confirmed],
    default: UserEmailConfirmedEnum.Unconfirmed,
  },
  utmSource: {
    type: String,
    required: false,
  },
  utmMedium: {
    type: String,
    required: false,
  },
  utmCampaign: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    set: async (value) => UserUtils.generateHashedPassword(value.toString())
  },
  avatarColor: {
    type: String,
    required: false
  }
}, {
  timestamps: true, // https://dynamoosejs.com/guide/Schema/#required-boolean
});


// userSchema.pre("save", async function (next) {
//   let user = this as UserDocument;

//   if (!user.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

//   const hash = await bcrypt.hashSync(user.password, salt);

//   user.password = hash;

//   return next();
// });

// userSchema.methods.comparePassword = async function (
//   candidatePassword: string
// ): Promise<boolean> {
//   const user = this as UserDocument;

//   return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
// };


/**
 * @todo - add a method for comparePassword: https://dynamoosejs.com/guide/Model#modelmethodssetname-function
 */
const UserModel = dynamoose.model<UserDocument>("User", userSchema);

export default UserModel;
