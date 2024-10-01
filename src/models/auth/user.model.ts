import dynamoose from "dynamoose";
import type { Item } from "dynamoose/dist/Item";
import { UserUtils } from '../../service/user/user.utils';
import type { GenericMediaItem } from '../imageAssets';

/** What the user must provide to create their user account */
export interface UserInput {
  
  /** User's firstname */
  firstname: string;
  /** User's lastname */
  lastname: string;
  /** User's email */
  email: string;
  /** Telegram username, without the @ */
  telegram?: string;
  /** User's nickname */
  nickname?: string;
  /** User phone number - will also work on WhatsApp */
  mobile: string;
  /** User's identity document */
  identity?: {
    /** User's DNI or NIE/TIE or Passport number */
    documentNumber: string;
    /** The type of document for the document number */
    documentType: "DNI" | "TIE" | "PASSPORT" | "OTHER";
  };
  /** Profile info about the user - will be HTML */
  about: string;
  /** User's current location city in Spain. Ex: Barcelona */
  currentLocation: string;
  /** ID of the neighbourhood */
  barrioId: number;
  /** UTC of the time that the user arrived in BCN */
  arrivedInBarcelona: string;
  /** User's profile pic */
  profilePhoto: GenericMediaItem[];
  /** List of tag-like interests that the user has, like hiking, photography, cycling, food etc */
  interests: string[];
  /** List of Group IDs that the user is following */
  followingGroupIds: string[];

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
  ReadOnly = 2,
  Disabled = 3,
  Banned = 4,
  Deleted = 5,
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

  /** What they used to auth/login with */
  authMethod: "FB" | "IG" | "GOOGLE" | "EMAIL";
  /** The external auth token of their auth session */
  authToken: string;
  /** UTC of when user signed up */
  signupDate: string;
  /** UTC of user's last logged-in time */
  lastLogin: string;
  /** Encrypted password */
  password: string;
  /** For resetting password via email */
  passwordResetToken?: string;
  /** If the user is a verified user (requires an admin to set) */
  isVerified?: boolean;

  /** Allows users to have credit to spend on going to paid events */
  credit: number;
  /** User's meetup role - @todo */
  // role: MeetupUserRole;

  /** Number of RSVPs that the user has done up to now */
  completedRSVPs: number;
  
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
