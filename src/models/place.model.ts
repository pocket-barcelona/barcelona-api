import * as dynamoose from "dynamoose";
import type { Document } from "dynamoose/dist/Document";
import type { ChildrenEnum } from "./enums/children.enum";
import type { CommitmentEnum } from "./enums/commitment.enum";
import type { PriceEnum } from "./enums/price.enum";
import type { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import type { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import type { TimeOfDayEnum } from "./enums/tod.enum";
import type { CategoryIdEnum } from "./enums/categoryid.enum";
import type { TeenagerEnum } from "./enums/teenager.enum";
import type { ImageAssets } from './imageAssets';

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
  /** The category ID for this place. See Categories */
  categoryId: CategoryIdEnum;
  /** 0=Has no posterimage. 1=Has poster image */
  hasImage: boolean;
  /** The official name of the place */
  labelCat: string;
  /** The name of the place in Spanish */
  labelEsp: string;
  /** The name of the place in English */
  labelEng: string;
  /**
   * slug is a URL-friendly version of the place name, without a slash
   */
  slug: string;
  /**
   * Useful remarks about the place
   * Ex. There is an entrance fee to get into the castle but it includes entrance to the museum, too
   */
  remarks: string;
  /**
   * A short description of the place
   * Ex. A busy market for the local people of Barceloneta
   */
  description: string;
  /** The amount of time we would recommend to spend at the place, or doing the activity */
  timeRecommended: TimeRecommendedEnum;
  /** The best time of day to visit */
  bestTod: TimeOfDayEnum;
  /** The approximate level of commitment required to visit the place (Scale is 1-5) */
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
  /** True if place is considered a tourist attraction */
  touristAttraction: boolean;
  /** @todo - make different to touristAttraction? Whether or not the place is considered popular for tourists, by us. TRUE=Classic or well-known tourist attraction */
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
  /** Place is available on a daily basis? */
  availableDaily: boolean;
  /** Place is available on a sunday? */
  availableSundays: boolean;
  /** Place requires booking?  */
  requiresBooking: RequiresBookingEnum;
  /** The metro/train zone number for this place, ex. 1, 2, 3... (applies to Barcelona only). -1 and -2 are outside of Barcelona */
  metroZone: number;
  /** @todo - check original data as it contains 1,2,3 etc...! Place is a physical landmark? */
  isLandmark: boolean;
  /** @todo */
  isPhysicalLocation: number;
  /** The place latitude, like 41.37... */
  lat: number;
  /** The place longitude, like 2.19... */
  lng: number;
  /** If the lat/lng value is accurate, or not */
  latlngAccurate: boolean;
  /** The Google Maps recommended zoom. Default=0 (UI will decide), Number=zoom Ex. 18 */
  mapZoom: number;
  /** The official website for this place */
  website: string;
  /** 0=Does not have a related place. [ID]=The ID of the related place to this one */
  relatedPlaceId: number;
  /** 1=Permission to use (taken by us). 0=From stock photo or open source location. -1=Not taken by us, not free to use */
  photoOwnership: number;
  /** A list of tags to assist with searching places. Ex. beach,playa,platja */
  tags: string;
  
  // ADDITIONAL FIELDS
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
  hasImage: {
    type: Boolean,
    required: true,
  },
  labelCat: {
    type: String,
    required: true,
  },
  labelEsp: {
    type: String,
    required: true,
  },
  labelEng: {
    type: String,
    required: true,
  },
  slug: {
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
  freeToVisit: {
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
  touristAttraction: {
    type: Boolean,
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
  requiresBooking: {
    type: Number,
    required: true,
  },
  metroZone: {
    type: Number,
    required: true,
  },
  isLandmark: {
    type: Boolean,
    required: true,
  },
  isPhysicalLocation: {
    type: Number,
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
  latlngAccurate: {
    type: Boolean,
    required: true,
  },
  mapZoom: {
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
  photoOwnership: {
    type: Number,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME_PLACES = 'Places';
const PlaceModel = dynamoose.model<PlaceDocument>(TABLE_NAME_PLACES, placeSchema);

export default PlaceModel;
