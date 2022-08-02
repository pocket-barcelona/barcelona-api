import {
  DrinkCategoryEnum,
  FoodCategoryEnum,
} from "../../models/enums/foodcategory.enum";
import { RequiresBookingEnum } from "../../models/enums/requiresbooking.enum";
import { TimeRecommendedEnum } from "../../models/enums/timerecommended.enum";
import {
  PlanThemeEnum,
  StructuredPlanDayProfile,
} from "../../models/planThemes.model";

export const themesTestData: StructuredPlanDayProfile[] = [
  {
    id: 1,
    theme: PlanThemeEnum.Location,
    name: "The Gothic Quarter and El Born",
    barrioIds: [12, 13],
    categoryIds: [2, 5, 7, 9],
  },
  {
    id: 2,
    theme: PlanThemeEnum.Location,
    name: "Best of El Raval",
    barrioIds: [11],
    popular: true,
    seasonal: false,
    // more?
  },
  {
    id: 3,
    theme: PlanThemeEnum.Location,
    name: "Best of Sant Antoni",
    barrioIds: [20],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 4,
    theme: PlanThemeEnum.Location,
    name: "Best of Gràcia",
    barrioIds: [38],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 5,
    theme: PlanThemeEnum.Location,
    name: "Best of El Born",
    barrioIds: [13],
    seasonal: false,
    orderBy: [
      {
        key: 'popular',
        direction: 'ASC',
        valueType: 'BOOLEAN',
      }
    ]
    // popular: true,
    // more?
  },
  {
    id: 6,
    theme: PlanThemeEnum.Location,
    name: "Best of El Barri Gòtic",
    barrioIds: [12],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 7,
    theme: PlanThemeEnum.Location,
    name: "Best of La Barceloneta",
    barrioIds: [14],
    seasonal: false,
    // popular: true,
    // more?
  },
  {
    id: 8,
    theme: PlanThemeEnum.Location,
    name: "Best of Eixample",
    barrioIds: [15,16,17],
    seasonal: false,
    // popular: true,
    // more?
  },
  
  {
    id: 101,
    theme: PlanThemeEnum.Category,
    name: "Barcelona Beach Tour",
    categoryIds: [1],
    metroZone: 1,
    daytrip: 0,
    orderBy: [
      {
        key: "lat",
        direction: "ASC",
      },
      // {
      //   key: "lng",
      //   direction: "ASC",
      // },
    ],
    placeIdsExclude: [215],
  },
  {
    // pick a bunch of places on the way from A to B, using lat start, lng start, bearing is calculated
    // might need an ancient building flag?
    id: 102,
    theme: PlanThemeEnum.Category,
    name: [
      "Ancient buildings - self-guided walking tour",
      "Historical Buildings Tour",
    ],
    categoryIds: [9],
    placeIdsAlwaysInclude: [119], // the cathedral
    barrioIds: [],
    start: { lat: 1.0, lng: 1.0 },
    end: { lat: 1.0, lng: 1.0 },
  },
  {
    id: 103,
    theme: PlanThemeEnum.Category,
    name: "Inner-city markets tour",
    categoryIds: [10],
    barrioIds: [], // include central barrios
    keyword: "market",
    seasonal: false,
    freeToVisit: 1,
    // placeIds: [63], // include sant antoni market 63?
    limit: 4,
  },
  {
    id: 104,
    theme: PlanThemeEnum.Category,
    name: ["Parks and countryside around Barcelona", "Parks & green spaces around BCN"],
    verbs: ["Take a walk around"],
    categoryIds: [11],
    barrioIds: [35, 48, 44, 46],
    seasonal: false,
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 1041,
    theme: PlanThemeEnum.Category,
    name: "Unique Barcelona Experiences",
    categoryIds: [3],
    seasonal: false,
    placeIds: [72,148,71,64,4,57,58,114,288,13,154],
    placeIdsChooseAmount: 4,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    limit: 4,
  },
  { // @todo!
    id: 105,
    theme: PlanThemeEnum.Category,
    name: ["Cathedrals and Churches in central Barcelona"],
    categoryIds: [225, 119],
    barrioIds: [35, 48, 44, 46],
    seasonal: false,
    freeToVisit: 1,
    limit: 4,
  },
  {
    id: 1051,
    theme: PlanThemeEnum.Category,
    name: "Go Shopping in Barcelona",
    categoryIds: [10],
    placeIds: [274,42,21,22,271,282,10,143,118,9,142,237],
    placeIdsChooseAmount: 5,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    // limit: 2,
  },
  {
    id: 106,
    theme: PlanThemeEnum.Category,
    name: "5 Plaza's in a day",
    categoryIds: [5],
    placeIdsChooseAmount: 5,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    metroZone: 1,
    limit: 5,
  },
  {
    id: 107,
    theme: PlanThemeEnum.Category,
    name: "3 Museums, 1 Day",
    categoryIds: [7],
    // placeIdsChooseAmount: 3,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    metroZone: 1,
    limit: 3,
  },
  {
    id: 108,
    theme: PlanThemeEnum.Category,
    name: "Central Museums Tour, Barcelona",
    categoryIds: [7],
    placeIdsChooseAmount: 3,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    metroZone: 1,
    barrioIds: [11,12,13,14],
    limit: 3,
  },
  { // @todo - cannot see the sea from some!
    id: 201,
    theme: PlanThemeEnum.Trips,
    // could be "Top X ..."
    name: "Top 5 Sea Viewpoints", // change to Incredible not Top?
    categoryIds: [8],
    limit: 5,
    // placeIds: [],
  },
  {
    id: 202,
    theme: PlanThemeEnum.Trips,
    name: "Park Guell and Lunch",
    verbs: ['Walk to'],
    // barrioIds: [40], // helps with accuracy of food/drink recommendations
    placeIds: [45, 270],
    placeIdsOptional: [283],
    placeIdsAreOrdered: true,
  },
  {
    id: 203,
    theme: PlanThemeEnum.Trips,
    verbs: ['Daytrip to'],
    name: "Day trip to {place}",
    categoryIds: [6],
    provinceId: 2,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    limit: 1,
  },
  { // untested
    id: 204,
    theme: PlanThemeEnum.Trips,
    name: "Costa Brava Daytrip",
    barrioIds: [86],
    provinceId: 2,
    orderBy: [
      {
        key: 'lat',
        direction: 'DESC',
      }
    ],
    limit: 3,
  },
  { // untested
    id: 205,
    theme: PlanThemeEnum.Trips,
    name: "Mini daytrip to {place}",
    categoryIds: [8],
    provinceId: 2,
    orderBy: [
      {
        key: 'placeId',
        direction: 'RANDOM',
      }
    ],
    limit: 1,
  },

  {
    id: 301,
    theme: PlanThemeEnum.FoodAndDrink,
    name: "Brunch and the Beach",
    // [Poblenou/Born/Gothic/Raval]
    barrioIds: [79, 13, 12, 11], //@todo - no results sometimes as waiting for restaurants
    barrioIdsChooseAmount: 1,
    categoryIds: [1],
    // categoryIdsChooseAmount: 1,
    foodCategories: [FoodCategoryEnum.Brunch],
  },
  // {
  //   id: 302,
  //   name: '',
  // }
  {
    id: 401,
    theme: PlanThemeEnum.NightsOut,
    name: "Best of Craft Beer in Barcelona",
    drinkCategories: [DrinkCategoryEnum.CraftBeer],
    internal: 0,
  },
  // {
  //   id: 402,
  //   name: '',
  // }
  {
    id: 501,
    theme: PlanThemeEnum.BestOf,
    name: "Best of El Gotico",
    popular: true,
    barrioIds: [12],
    timeRecommendedOptions: [
      TimeRecommendedEnum.CoupleOfHours,
      TimeRecommendedEnum.HalfDay,
    ],
    requiresBookingOptions: [
      RequiresBookingEnum.No,
      RequiresBookingEnum.OnArrival,
    ],
    limit: 15,
    orderBy: [
      {
        key: 'lng',
        direction: 'ASC',
      }
    ],
  },
  {
    id: 502,
    theme: PlanThemeEnum.BestOf, // @todo change?
    name: 'Get sporty in Barcelona',
    categoryIds: [12],
    placeIds: [36,37,6,285,158,290],
    placeIdsChooseAmount: 3,
    daytrip: 0,
    limit: 4,
  },
  {
    id: 601,
    theme: PlanThemeEnum.Route,
    name: "Discover Montjuic and the Castle",
    // barrioIds: [26],
    categoryIds: [],
    placeIds: [
      72, 246, 77, 78, 220, 135, 224, 221, 245, 222, 247, 71, 293, 292, 76, 149,
      73, 295, 294, 115, 244, 74, 75, 228, 146, 145, 242, 79, 10, 286,
    ],
    placeIdsAreOrdered: true,
    // more?
  },
];

// ------
// THEMES
// ------

// LOCATION BASED, no food - casual walking
// 1. The Gothic Quarter and El Born
// 2. Best of El Raval
// 3. Best of Sant Antoni
// Historical Barcelona, central neighbourhoods
// Gothic Quarter tour
// Maritime passage - walking tour
// Marina area, boats and beaches
// Football stadium?
// Tibidabo walking trip
// Olimpic village etc
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


// 1xx CATEGORY BASED
// 101. Barcelona Beach Tour
// 102a. Ancient buildings - self-guided walking tour
// 102b. Historical Buildings Tour
// 103. Inner-city markets tour
// 104a. Parks and countryside around Barcelona
// 104b. Parks & green spaces around BCN
// 105. Cathedrals and Churches in central Barcelona
// Cathedral and Beaches
// Plaza Tour
// Best of cities around Barcelona
// Parks and green spaces in Barcelona
// Badalona and montgat - beach trip
// Best viewpoints from up high
// Barcelona Beaches trip
// Best beaches in Barcelona
// Top 5 beaches
// Museums in the city
// 20 things to do for free - 3 days
// Sporty Barcelona


// 2xx DAY TRIPS & TRIPS
// 201. Top 5 Sea Viewpoints
// 202. Park Guell and Lunch
// 203. Day trip to [place]
// 204. Costa Brava trip
// 205. Girona day trip
// Costa Brava by car
// Aquatic park day trip
// Brunch in Castelldefels
// Lunch in Gava Chiringuito
// (Places around Begur, Parafrugell etc)
// Hidden places, montjuic
// Hidden bars, Barcelona
// Discover Montjuic, Cable Cars and the Castle
// Montjuic by foot
// Medieval architecture and Gothic self-guided walking tour
// Insider hidden secrets of Barcelona
// 5 Castles in 5 days (Montjuic, Castell de Cornellà, Tossa de Mar, Castell de Castelldefels, Castell de Torre del Baró, Castell del Papiol, Castell de Burriac)
// Las Ramblas and Boqueria Market
// Historical wonders of Barcelona
// Discover medieval Barcelona
// Top 4 Churches and cathedrals in Barcelona (cathedral, Santa Maria Mar/Pi, Sagrada Familia)
// Lunch in Sants then the magic fountain (friday only?)
// Arc de triomf and the city park - on foot
// [Gava/Castelldefels/Montgat/Badalona] day trip


// FOOD & DRINK
// 301. Brunch in [Poblenou/Born/Gothic/Raval] + Beach
// Wine & Tapas
// Best paella?
// Eixample food tour
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
// Cocktails, central Barcelona


// NIGHTS OUT
// 401. Best of Craft Beer in Barcelona
// Clubbing in upper diagonal, Tusset?
// Carrer d'Avinyo - best of bars
// Carrer de Ample - hidden bars
// Plaza San Miguel, bars and food
// Plaza de George Orwell, beers and cubatas
// Pub crawl, El Born
// Pub crawl, El Gotico
// Enric Granados and Eixample. Also Balmes, Arribau, Muntaner


// BEST OF
// 501. Best of El Gotico
// Best sunset view
// Best spots for lunch
// Best pizzas


// ROUTES
// 1. Discover Montjuic and the castle