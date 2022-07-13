import BarrioModel from "./barrio.model";
import CategoryModel from "./category.model";

export interface StructuredPlanDayProfile {
  // day: number;
  id: number;
  name: string;
  categoryIds?: Array<typeof CategoryModel['categoryId']>;
  barrioIds?: Array<typeof BarrioModel['barrioId']>;
}

/**
 * The list of plans for a day. A day (could) be defined to be like this
 */
type PlanThemes = 'location' | 'category' | 'trips' | 'fooddrink' | 'nightsout' | 'bestof';

export const planThemes: Record<PlanThemes, StructuredPlanDayProfile[]> = {
  location: [
    {
      id: 1,
      name: 'The Gothic Quarter and El Born',
      barrioIds: [12, 13],
      categoryIds: [2, 5, 7, 9],
    },
  ],
  category: [],
  trips: [],
  fooddrink: [],
  nightsout: [],
  bestof: [],
}

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



// DAY TRIPS
// Costa Brava by car
// Aquatic park day trip
// Brunch in Castelldefels
// Lunch in Gava Chiringuito

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


// BEST OF
// Best spots for lunch
// Best pizzas

