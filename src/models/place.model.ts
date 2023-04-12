import * as dynamoose from "dynamoose";
import { Document } from "dynamoose/dist/Document";
import { ChildrenEnum } from "./enums/children.enum";
import { CommitmentEnum } from "./enums/commitment.enum";
import { PriceEnum } from "./enums/price.enum";
import { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import { TimeOfDayEnum } from "./enums/tod.enum";
import { CategoryIdEnum } from "./enums/categoryid.enum";
import { TeenagerEnum } from "./enums/teenager.enum";
import { ImageAssets } from './imageAssets';

interface PlaceRating {
  rating: string
  ratingIndex: number;
  ratingStars: string[];
}

export interface PlaceInput {
  /** The place ID */
  placeId: number;
  /** If the place is active in listings (1=Visible, 0=Hidden) */
  active: boolean;
  /** The province ID that this place is in. See Provinces */
  provinceId: number;
  /** The town that this place is in, ex. Barcelona or Girona... */
  placeTown: string;
  /** The neighbourhood ID that this place is in. Note - there is a special ID for places outside of Barcelona which is 86 */
  barrioId: number;
  /** The category ID for this place or activity. See Categories */
  categoryId: CategoryIdEnum;
  /** The official name of the place or activity. Note: Could be in Catalan */
  nameOfficial: string;
  /** The official name of the place or activity, but without accents. Note: Could be in Catalan */
  nameOfficialAccentless: string;
  /** The name of the place or activity, in English. This label will most likely be used on the UI */
  nameEnglish: string;
  /**
   * urlSlug is a URL-friendly version of the place name, without a slash
   */
  urlSlug: string;
  /**
   * Useful remarks about the place or activity
   * Ex. There is an entrance fee to get into the castle but it includes entrance to the museum, too
   */
  remarks: string;
  /**
   * A short description of the place or activity
   * Ex. A busy market for the local people of Barceloneta
   */
  description: string;
  /** The amount of time we would recommend to spend at the place, or doing the activity */
  timeRecommended: TimeRecommendedEnum;
  /** The best time of day to visit */
  bestTod: TimeOfDayEnum;
  /** The approximate level of commitment required to visit the place or activity (Scale is 1-5) */
  commitmentRequired: CommitmentEnum;
  /**
   * The estimated price people could spend at this place or doing this activity
   * Options: Free
   * Very cheap, Cheap, Moderate, Quite expensive, Very expensive
   * @todo - This does not factor in booking fees, tickets, transport costs or buying anything while you are there
   */
  price: PriceEnum;
  /**
   * 1=Free to visit and look around.
   * 0=Not really possible to visit, e.g. need to pay to enter so only worth going if paying.
   * -1=Not sure or no data yet.
   * Ex. Sagrada Familia (1) is interesting to see, even without paying to go in!
   */
  freeToVisit: number;
  /** The level of suitability for children */
  childrenSuitability: ChildrenEnum;
  /** The level of suitability for teenagers */
  teenagerSuitability: TeenagerEnum;
  /** Whether or not the place is considered popular for tourists, by us. TRUE=Classic or well-known tourist attraction */
  popular: boolean;
  /** A number between 0-100 in order to boost the place listing in search results. Values are normalised, so most places have zero */
  boost: number;
  /** 1=Availability only part or once in the year. 0=Available all year round */
  annualOnly: boolean;
  /** 
   * @todo - could make Spring, Summer, Autumn, Winter bitwise value
   * TRUE=Seasonal availability, FALSE=Available or accessible in all seasons
   * */
  seasonal: boolean;
  /** 0=Can be done inside a day. 1=Probably requires a full day to do. 2=Requires more, ex. is outside the city */
  daytrip: number;
  /** Place or activity is available on a daily basis? */
  availableDaily: boolean;
  /** Place or activity is available on a sunday? */
  availableSundays: boolean;
  /** @todo - check original data as it contains 1,2,3 etc...! Place or activity is a physical landmark? */
  physicalLandmark: boolean;
  /** Place or activity requires booking?  */
  requiresBooking: RequiresBookingEnum;
  /** The metro/train zone number for this place or activity, ex. 1, 2, 3... (applies to Barcelona only). -1 and -2 are outside of Barcelona */
  metroZone: number;
  /** If the lat/lng value is accurate, or not */
  latlngAccurate: boolean;
  /** The place latitude, like 41.37... */
  lat: number;
  /** The place longitude, like 2.19... */
  lng: number;
  /** The Google Maps recommended zoom. Default=0 (UI will decide), Number=zoom Ex. 18 */
  zoom: number;
  /** The official website for this place or activity */
  website: string;
  /** 0=Does not have a related place. [ID]=The ID of the related place to this one */
  relatedPlaceId: number;
  /** 0=Has no posterimage. 1=Has poster image */
  hasImage: boolean;
  /** 1=Permission to use (taken by us). 0=From stock photo or open source location. -1=Not taken by us, not free to use */
  imageOwnership: number;
  /** A list of tags to assist with searching places. Ex. beach,playa,platja */
  tags: string;
  /** If true, this item's data requires checking as it may not be accurate */
  requiresChecking: boolean;
  
  images?: ImageAssets[];
  rating?: PlaceRating;
  province?: string;
  /** The distance this place is away from some lat/lng */
  distance?: number;
  // @todo - place status or under moderation?
}

export interface PlaceDocument extends PlaceInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const placeSchema = new dynamoose.Schema({
  placeId: {
    type: Number,
    required: true,
    hashKey: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  provinceId: {
    type: Number,
    required: true,
  },
  placeTown: {
    type: String,
    required: true,
  },
  barrioId: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: Number,
    required: true,
  },
  nameOfficial: {
    type: String,
    required: true,
  },
  nameOfficialAccentless: {
    type: String,
    required: true,
  },
  nameEnglish: {
    type: String,
    required: true,
  },
  urlSlug: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeRecommended: {
    type: Number, // ENUM
    required: true,
  },
  bestTod: {
    type: Number,
    required: true,
  },
  commitmentRequired: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  childrenSuitability: {
    type: Number,
    required: true,
  },
  teenagerSuitability: {
    type: Number,
    required: true,
  },
  popular: {
    type: Boolean,
    required: true,
  },
  boost: {
    type: Number,
    required: true,
  },
  annualOnly: {
    type: Boolean,
    required: true,
  },
  seasonal: {
    type: Boolean,
    required: true,
  },
  daytrip: {
    type: Number,
    required: true,
  },
  availableDaily: {
    type: Boolean,
    required: true,
  },
  availableSundays: {
    type: Boolean,
    required: true,
  },
  physicalLandmark: {
    type: Boolean,
    required: true,
  },
  requiresBooking: {
    type: Number,
    required: true,
  },
  metroZone: {
    type: Number,
    required: true,
  },
  latlngAccurate: {
    type: Boolean,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  zoom: {
    type: Number,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  relatedPlaceId: {
    type: Number,
    required: true,
  },
  hasImage: {
    type: Boolean,
    required: true,
  },
  imageOwnership: {
    type: Number,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  requiresChecking: {
    type: Boolean,
    required: true,
  },
}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME_PLACES = 'Places';
const PlaceModel = dynamoose.model<PlaceDocument>(TABLE_NAME_PLACES, placeSchema);

export default PlaceModel;
