/**
 * POI = Points of Interest
 * Include:
 * Bars, Restaurants, Coffee Shops, Clubs etc
 * */

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

export interface PoiInput {
  /** The POI ID */
  poiId: number;
  /** If the record is active in listings (1=Visible, 0=Hidden) */
  active: boolean;
  /** The province ID that this place is in. See Provinces */
  provinceId: number;
  /** The neighbourhood ID that this place is in. Note - there is a special ID for places outside of Barcelona */
  barrioId: number;
  /** The category ID for this place or activity. See Categories */
  categoryId: CategoryIdEnum;
  
  /** The official name of the place or activity. Note: Could be in Catalan */
  nameOfficial: string;
  /** The official name of the place or activity, but without accents. Note: Could be in Catalan */
  nameOfficialAccentless: string;
  /**
  * urlSlug is a URL-friendly version of the place name, without a slash
  */
  urlSlug: string;
  /**
  * A short description of the place or activity
  * Ex. A busy market for the local people of Barceloneta
  */
  description: string;
  
  /** The amount of time we would recommend to spend at the place, or doing the activity */
  // timeRecommended: TimeRecommendedEnum;
  
  /** The best time of day to visit */
  bestTod: TimeOfDayEnum;
  
  /** The approximate level of commitment required to visit the place or activity (Scale is 1-5) */
  // commitmentRequired: CommitmentEnum;
  /**
  * The estimated price point for this place. 0 = no data
  */
  price: 0 | 1 | 2 | 3;
  
  /** A number between 0-100 in order to boost the place listing in search results. Values are normalised, so most places have zero */
  boost: number;

  /** Place or activity requires booking?  */
  requiresBooking: RequiresBookingEnum;
  
  latlngAccurate: boolean;
  /** The place latitude */
  lat: number;
  /** The place longitude */
  lng: number;
  /** EX. "ES" */
  countryCode: string;
  /** The official website for this place or activity */
  website: string;
  /** A list of tags to assist with searching places. Ex. beach,playa,platja */
  tags: string;
}

export interface PoiDocument extends PoiInput, Document {
  createdAt: Date;
  updatedAt: Date;
}

const poiSchema = new dynamoose.Schema({
  poiId: {
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
  // nameEnglish: {
  //   type: String,
  //   required: true,
  // },
  urlSlug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // timeRecommended: {
  //   type: Number, // ENUM
  //   required: true,
  // },
  bestTod: {
    type: Number,
    required: true,
  },
  // commitmentRequired: {
  //   type: Number,
  //   required: true,
  // },
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
  boost: {
    type: Number,
    required: true,
  },
  
  
  
  requiresBooking: {
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
  website: {
    type: String,
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


export const TABLE_NAME_POI = 'Poi';
const PoiModel = dynamoose.model<PoiDocument>(TABLE_NAME_POI, poiSchema);

export default PoiModel;
