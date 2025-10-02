import dynamoose from 'dynamoose';
import type { Item } from 'dynamoose/dist/Item.js';
import { UserUtils } from '../../service/user/user.utils.js';
import { type GenericMediaItem, genericMediaAssetSchema } from '../imageAssets.model.js';

/** What the user must provide to create their user account */
export interface UserInput {
	/** User's email - UNIQUE / PRIMARY KEY */
	email: string;
	/** Newly registered users are 0 (unconfirmed). After clicking email link, become confirmed */
	emailConfirmed: UserEmailConfirmedEnum;
	/** An auto-generated uuid for the user */
	userId: string;
	/** The user's role */
	role: UserRoleEnum;
	/** User active status */
	userStatus: UserStatusEnum;
	/** What they used to auth/login with */
	authMethod: 'FB' | 'IG' | 'GOOGLE' | 'EMAIL';
	/** The external auth token of their auth session */
	authToken: string;
	/** UTC of when user signed up */
	signupDate: Date;
	/** UTC of user's last logged-in time */
	lastLogin: Date;
	/** If the user is a verified user (requires an admin to set) */
	isVerified?: boolean;
	/** Allows users to have credit to spend on going to paid events */
	credit: number;
	/** Number of RSVPs that the user has done up to now */
	completedRSVPs: number;
	/** User's firstname */
	firstname: string;
	/** User's lastname */
	lastname: string;
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
		/** The type of document for the document number. "DNI" | "TIE" | "PASSPORT" | "OTHER" */
		documentType: string;
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

	/** Where the signup came from - for marketing campaigns */
	utmSource: string;
	utmMedium: string;
	utmCampaign: string;
	avatarColor: string;
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
export enum UserRoleEnum {
	Admin = 1, // super admin of the system
	Owner = 2, // admin of e.g a meetup group
	User = 3, // normal user
	Guest = 4, // guest
	Demo = 5, // not implement yet
}
export enum CheckResetTokenEnum {
	NoDocument = 1,
	TokenMismatch = 2,
	TokenExpired = 3,
	TokenValid = 4,
}

export interface UserDocument extends Item, UserInput {
	/** Encrypted password */
	password: string;
	/** For resetting password via email */
	passwordResetToken?: string;
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

const identitySchema = new dynamoose.Schema(
	{
		documentNumber: {
			type: String,
		},
		documentType: {
			type: String,
		},
	},
	{
		timestamps: false,
		saveUnknown: false,
	}
);

const userSchema = new dynamoose.Schema(
	{
		email: {
			type: String,
			required: true,
			hashKey: true,
			// index: true, // this throws an error in getUserById() !
		},
		emailConfirmed: {
			type: Number,
			required: true,
			enum: [UserEmailConfirmedEnum.Unconfirmed, UserEmailConfirmedEnum.Confirmed],
			default: UserEmailConfirmedEnum.Unconfirmed,
		},
		userId: {
			type: String,
			required: true,
			// default: uuidv4(),
			// index: true,
		},
		password: {
			type: String,
			required: true,
			set: async (value) => UserUtils.generateHashedPassword(value.toString()),
		},
		passwordResetToken: {
			type: String,
			default: '',
		},
		role: {
			type: Number,
			required: true,
		},
		userStatus: {
			type: Number,
			required: true,
			enum: [
				UserStatusEnum.Active,
				UserStatusEnum.ReadOnly,
				UserStatusEnum.Disabled,
				UserStatusEnum.Banned,
				UserStatusEnum.Deleted,
			],
			default: UserStatusEnum.Active,
		},
		authMethod: {
			type: String,
			required: true,
		},
		authToken: {
			type: String,
		},
		signupDate: {
			type: Date,
		},
		lastLogin: {
			type: Date,
		},
		isVerified: {
			type: Boolean,
			required: true,
		},
		credit: {
			type: Number,
			required: true,
		},
		completedRSVPs: {
			type: Number,
		},
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		nickname: {
			type: String,
		},
		telegram: {
			type: String,
		},
		mobile: {
			type: String,
		},
		identity: {
			type: Object,
			schema: [identitySchema],
		},
		about: {
			type: String,
		},
		currentLocation: {
			type: String,
		},
		barrioId: {
			type: Number,
		},
		arrivedInBarcelona: {
			type: Date,
		},
		profilePhoto: {
			type: Array,
			schema: [genericMediaAssetSchema],
		},
		interests: {
			type: Array,
			schema: [
				{
					type: String,
				},
			],
		},
		followingGroupIds: {
			type: Array,
			schema: [
				{
					type: String,
				},
			],
		},
		utmSource: {
			type: String,
		},
		utmMedium: {
			type: String,
		},
		utmCampaign: {
			type: String,
		},
		avatarColor: {
			type: String,
		},
	},
	{
		timestamps: true,
		saveUnknown: false,
	}
);

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
const UserModel = dynamoose.model<UserDocument>('User', userSchema);

export default UserModel;
