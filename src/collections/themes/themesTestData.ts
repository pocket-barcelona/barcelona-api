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
    // more?
  },
  {
    id: 3,
    theme: PlanThemeEnum.Location,
    name: "Best of Sant Antoni",
    barrioIds: [20],
    // popular: true,
    // more?
  },
  
  {
    id: 101,
    theme: PlanThemeEnum.Category,
    name: "Barcelona Beach Tour",
    categoryIds: [1],
    metroZone: 1,
    orderBy: [
      {
        key: "lat",
        direction: "ASC",
      },
      {
        key: "lng",
        direction: "ASC",
      },
    ],
    placeIdsExclude: [215],
  },
  {
    // pick a bunch of places on the way from A to B, using lat start, lng start, bearing is calculated
    // might need an ancient building flag?
    id: 102,
    theme: PlanThemeEnum.Category,
    name: "Ancient buildings - self-guided walking tour",
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
    // barrioIds: [40], // helps with accuracy of food/drink recommendations
    placeIds: [45, 270],
    placeIdsOptional: [283],
    placeIdsAreOrdered: true,
  },
  {
    id: 301,
    theme: PlanThemeEnum.FoodAndDrink,
    name: "Brunch and the Beach",
    // [Poblenou/Born/Gothic/Raval]
    barrioIds: [79, 13, 12, 11],
    barrioIdsChooseAmount: 1,
    categoryIds: [1],
    categoryIdsChooseAmount: 1,
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
    internal: 2,
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
    randomize: true,
  },
  // {
  //   id: 502,
  //   name: '',
  // }
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
// Costa Brava trip
// Girona day trip
// (Places around Begur, Parafrugell etc)
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


// CATEGORY BASED
// 101. Barcelona Beach Tour
// 102. Ancient buildings - self-guided walking tour
// 103. Inner-city markets tour
// Historical Buildings Tour
// Parks and countryside around BCN
// Parks & green spaces around BCN
// Cathedral and Beaches
// Cathedrals and Churches - central Barcelona
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


// DAY TRIPS
// Costa Brava by car
// Aquatic park day trip
// Brunch in Castelldefels
// Lunch in Gava Chiringuito


// TRIPS
// 201. Top 5 Sea Viewpoints
// 202. Park Guell and Lunch
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