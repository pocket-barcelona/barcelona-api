import { StructuredPlanDayProfile } from "../../models/planThemes.model";
import {
  ThemesBestOf,
  ThemesCategory,
  ThemesFoodAndDrink,
  ThemesLocation,
  ThemesNightsOut,
  ThemesRoute,
  ThemesTrips,
} from "./all";

// Parallel metro!
// 41.37510536783193, 2.1681203940848635
// 5 mins up the road from parallel! ~450m
// 41.37518964719392, 2.1625463009432675
const fiveMinsWalk = Math.abs(2.1625463009432675 - 2.1681203940848635);
export const WALKING_DISTANCES = {
  // todo
  small: fiveMinsWalk / 2,
  // 5 mins walk
  medium: fiveMinsWalk,
  large: fiveMinsWalk * 1.5,
};

// Near Balius Bar:
// 41.40204038325545, 2.2013210784114694

// Llacuna Metro:
// 41.3992152370966, 2.197241318454669

// Lat:
// 0,002825146159
// Lng:
// 0,004079759957

export const themesTestData: StructuredPlanDayProfile[] = [
  ...ThemesBestOf,
  ...ThemesCategory,
  ...ThemesFoodAndDrink,
  ...ThemesLocation,
  ...ThemesNightsOut,
  ...ThemesRoute,
  ...ThemesTrips,
];

// ------
// THEMES
// ------

// LOCATION BASED, no food - casual walking
// 1. The Gothic Quarter and El Born
// 2. Best of El Raval
// 3. Best of Sant Antoni
// X. Top 10 city attractions in Barcelona
// Top 25 Barcelona attractions (4 days)
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
// X Visit Plaza San Miguel's Bars & Restaurants
// X Enjoy Wine & Tapas in Central Barcelona
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
// X Carrer d'Avinyo - best of bars
// Clubbing in upper diagonal, Tusset?
// Carrer de Ample - hidden bars
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
// 1. Discover Montjuic and The castle
// 2. Discover Mount Tibidabo on Foot
// 3. Discover Park Guell on Foot
// 3a. Discover Park Guell on Foot (alternative route)
// 4. Discover The Bunkers of Carmel on Foot (route up escalators and lifts through the park)
// 5. Discover The Bunkers of Carmel on Foot (alternate route) (route from Guinardo from park)
// 6. Discover The Bunkers of Carmel on Foot (alternate route) (route from Alfons X)
// 7. City Park to La Sagrada Familia on foot
// 8. Barceloneta to The Forum, via W-Hotel and Beaches on foot
