import { Document, DocumentObjectFromSchemaSettings } from "dynamoose/dist/Document";
import { ObjectType } from "dynamoose/dist/General";
import { SerializerOptions } from "dynamoose/dist/Serializer";
import { CategoryDocument, CategoryInput } from "./category.model";
import { CategoryIdEnum } from "./enums/categoryid.enum";
import { ChildrenEnum } from "./enums/children.enum";
import { CommitmentEnum } from "./enums/commitment.enum";
import { PriceEnum } from "./enums/price.enum";
import { ProfileTypeEnum } from "./enums/profiletype.enum";
import { RequiresBookingEnum } from "./enums/requiresbooking.enum";
import { TeenagerEnum } from "./enums/teenager.enum";
import { TimeRecommendedEnum } from "./enums/timerecommended.enum";
import { TimeOfDayEnum } from "./enums/tod.enum";
import { EventInput } from "./event.model";
import { PlaceDocument, PlaceInput } from "./place.model";


// ------
// THEMES
// ------


// LOCATION BASED - casual walking
// The Gothic Quarter and El Born
// Cocktails, central Barcelona
// Historical Barcelona, central neighbourhoods
// Gothic Quarter tour
// Best of Raval
// Maritime passage - walking tour
// Marina area, boats and beaches
// Football stadium?
// Montjuic and the castle
// Tibidabo walking trip
// Costa Brava trip
// Girona day trip
// (Places around Begur, Parafrugell etc)
// Olimpic village etc
// Best of Sant Antoni
// Diagonal mar and the forum?
// Central park and El Born
// Carmel and the bunkers
// Badalona beaches & lunch
// Top 10 city attractions in Barcelona
// Top 25 Barcelona attractions (4 days)
// Port vell and lunch
// Raval, Gothic and Born - 1 day
// Sant Pere, Santa Caterina I La Ribera
// Barcelona Harbour on Foot


// LOCATION BASED - hiking
// Costa Brava calas - hiking



// DAY TRIPS
// Costa Brava by car
// Aquatic park day trip
// Brunch in Castelldefels
// Lunch in Gava Chiringuito


// CATEGORY BASED
// Beach Tour, Barcelona
// Historical Buildings Tour
// Parks and countryside around BCN
// Parks & green spaces around BCN
// Cathedral and beaches
// Ancient buildings - self-guided walking tour
// Plaza tour
// Best of cities around Barcelona
// Parks and green spaces in Barcelona
// Badalona and montgat - beach trip
// Best viewpoints from up high
// Barcelona Beaches trip
// Best beaches in Barcelona
// Top 5 beaches
// Museums in the city
// 20 things to do for free - 3 days



// FOOD & DRINK
// Wine & Tapas
// Best paella?
// Eixample food tour
// Best brunch in [Poblenou/Born/Gothic/Raval] + beach
// [Gracia/Born/etc] - burgers, beers & coffee
// [Barceloneta/Born/Gothic] - best Tapas spots
// Local wines tour (picks specific bars?)
// Best Catalan restaurants
// Calçotada and walk (can borell, seasonal?)
// Poblesec - recommended restaurants
// Best food on Carrer de Blai, El Poblesec
// Montaditos on Carrer Blai
// Brunch in Eixample
// Sant Antoni - best of food
// Best of China town and chinese restaurants
// Argentinian food in Barcelona
// Best lunches in Sant Antoni
// Wine tasting at Alta Alella
// Dinner near La Rambla de Catalunya
// Tacos & beers in [Eixample]


// NIGHTS OUT
// Clubbing in upper diagonal, Tusset?
// Carrer d'Avinyo - best of bars
// Carrer de Ample - hidden bars
// Plaza San Miguel, bars and food
// Plaza de George Orwell, beers and cubatas
// Pub crawl, El Born
// Pub crawl, El Gotico
// Craft beer tour, BCN
// Enric granados and Eixample. Also Balmes, Arribau, Muntaner


// SPECIFIC TRIPS
// 3 castles trip in (Montjuic, Tossa etc)
// Hidden places, montjuic
// Hidden bars, Barcelona
// Discover Montjuic, Cable Cars and the Castle
// Montjuic by foot
// Medieval architecture and Gothic self-guided walking tour
// Top 5 sea viewpoints
// Insider hidden secrets of Barcelona
// Park Guell and lunch
// Las Ramblas and Boqueria Market
// Historical wonders of Barcelona
// Discover medieval Barcelona
// Top 4 Churches and cathedrals in Barcelona (cathedral, Santa Maria Mar/Pi, Sagrada Familia)
// Lunch in Sants then the magic fountain (friday only?)
// Arc de triomf and the city park - on foot
// [Gava/Castelldefels/Montgat/Badalona] day trip


// BEST OF
// Best spots for lunch
// Best pizzas




/** The response of the planned plan */
export interface StructuredPlan {
    /** The title of the plan */
    planTitle: string;
    /** The theme of the plan used to seed the list of places. Same seed will produce random places each time */
    planTheme: string;
    /** The itinerary */
    itinerary: {
        /** The action the person will take. Examples:
         * Eat breakfast, have lunch, coffee's, dessert, dinner @, Drink cocktails @, etc...
        */
        action: string;
        /** The place or list of places for this action */
        places: PlaceInput[];
    }[];
    /** @todo - the URL for saving this exact itinerary for later */
    itinerarySaveUrl?: string;
    eventNotices: EventInput[];

    /** See itinerary summary model from PB */
    summary: {
        numberOfDays: number;
        /** Use budget ENUM */
        budget: number;
        /** includ */
        includesPlacesOutsideCity: boolean;
        easyWalking: boolean;
        categoriesIncluded: Array<CategoryDocument['categoryId']>;
        /** Spend time in 1 place or move around. Use ENUM */
        focusOnSameLocation: number;
        /** TOD Enum */
        timeOfDay: number;
        /** Plan is focussed on central neighbourhoods only */
        visitCentralBarriosOnly: boolean;
        excludePlaceIds: Array<PlaceDocument['placeId']>;
        visitingWithPets: boolean;
        visitingWithChildren: boolean;
        visitingWithTeenagers: boolean;
        includesFoodRecommendations: boolean;
        includesDrinkRecommendations: boolean;

        includesEventNotices: boolean;
    }
}

const place: PlaceInput = {
    placeId: 3,
    active: true,
    provinceId: 2,
    placeTown: "Barcelona",
    barrioId: 13,
    categoryId: CategoryIdEnum.Buildings,
    nameOfficial: "Arc De Triomf",
    nameOfficialAccentless: "Arc De Triomf",
    nameEnglish: "Arc De Triomf",
    urlSlug: "arc-de-triomf",
    remarks: "",
    description: "A monumental archway near to El Born and the city park",
    timeRecommended: TimeRecommendedEnum.CoupleOfHours,
    bestTod: TimeOfDayEnum.Day,
    commitmentRequired: CommitmentEnum.Casual,
    price: PriceEnum.Free,
    freeToVisit: 0,
    childrenSuitability: ChildrenEnum.Suitable,
    teenagerSuitability: TeenagerEnum.Recommended,
    popular: true,
    boost: 0,
    annualOnly: false,
    seasonal: false,
    daytrip: 0,
    availableDaily: true,
    availableSundays: true,
    physicalLandmark: true,
    requiresBooking: RequiresBookingEnum.No,
    metroZone: 1,
    latlngAccurate: true,
    lat: 41.391055,
    lng: 2.180644,
    zoom: 0,
    website: "",
    relatedPlaceId: 0,
    hasImage: true,
    imageOwnership: 1,
    tags: "arc",
    requiresChecking: false,
};

export const structuredPlanObj: StructuredPlan = {
    planTitle: 'Some plan',
    planTheme: 'a',
    itinerary: [
        {
            action: '',
            places: [
                {
                    ...place,
                }
            ]
        }
    ],
    eventNotices: [],
    summary: {
        numberOfDays: 1,
        budget: 0,
        includesPlacesOutsideCity: false,
        easyWalking: true,
        categoriesIncluded: [
            place.categoryId,
        ],
        focusOnSameLocation: 1,
        timeOfDay: 1,
        visitCentralBarriosOnly: true,
        excludePlaceIds: [],
        visitingWithPets: true,
        visitingWithChildren: true,
        visitingWithTeenagers: true,
        includesFoodRecommendations: true,
        includesDrinkRecommendations: true,
        includesEventNotices: false,
    }
}

/** The data required to generate a structured plan */
export interface PlanBuilderInput {
    /** The type of traveller that the plan is for */
    profileType: ProfileTypeEnum;
    /** Number of days for this plan: 1-7 */
    numberOfDays: number;
    /** Budget € - €€€€€ */
    budget: PriceEnum;
    /** Array of category IDs (requires min 3) */
    categoryIds: Array<CategoryInput['categoryId']>;
    /** Visit places outside BCN: boolean (Do you want to include day trips outside of Barcelona?) */
    includePlacesOutsideBarcelona: boolean;
    /** Can you walk between places easily? */
    walkBetweenPlacesEnabled: boolean;
    /** Time spent at each location: small or lots: 0 = any/don't mind */
    timeRecommended: TimeRecommendedEnum | 0;
    /** The preferred time of day, or 0=any */
    preferredTimeOfDay: TimeOfDayEnum | 0;
    /** Focus results on central neighbourhoods only? NULL=don't mind */
    centralBarriosOnly: boolean | null;
    /** A list of place IDs to not include in the results */
    excludePlaceIds: Array<PlaceInput['placeId']>;
    /** Are you visiting with pet/s? */
    visitingWithPets: boolean;
    /** Visiting with kids (less than 13) */
    visitingWithKids: boolean;
    /** Visiting with teenagers (less than 18) */
    visitingWithTeenagers: boolean;
    /** Whether or not to include food recommendations */
    includeFoodSuggestions: boolean;
    /** Whether or not to include drink recommendations */
    includeDrinkSuggestions: boolean;
    /** Whether or not to include late bar and night club suggestions */
    includeNightclubSuggestions: boolean;
    
    // ADVANCED

    /** Which dates will you be visiting? */
    travelDates?: {
        from: number;
        to: number;
    };
    /** Remarks about events which may be of interest or coincide with the recommended places */
    includeEventRemarks?: boolean;
    /** If true, booking remarks will be included in the results. Ex. ensure you book a ticket at this place before going... */
    bookingRemarks?: boolean;
    /** If given, results will be based on this location. @todo - could use barrio Ids instead */
    homeCentrePoint?: {
        lat: number;
        lng: number;
    };
    /** Try to include places and food/drink options near to the sea */
    preferPlacesNearTheSea?: boolean;
    /** True if has access to a car */
    hasCar?: boolean;
}


export const myPlanInput: PlanBuilderInput = {
    profileType: ProfileTypeEnum.FutureHoliday,
    numberOfDays: 3,
    budget: PriceEnum.Cheap,
    categoryIds: [1, 5, 7, 8],
    includePlacesOutsideBarcelona: false,
    walkBetweenPlacesEnabled: true,
    timeRecommended: TimeRecommendedEnum.QuarterDay,
    preferredTimeOfDay: 0,
    centralBarriosOnly: true,
    excludePlaceIds: [21],
    visitingWithPets: false,
    visitingWithKids: false,
    visitingWithTeenagers: false,
    includeFoodSuggestions: true,
    includeDrinkSuggestions: true,
    includeNightclubSuggestions: true,
};