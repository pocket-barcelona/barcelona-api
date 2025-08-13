export enum FilterTypesEnum {
	Page = 'page',
	PageSize = 'page_size',
	Entity = 'entity',
	OrderBy = 'order_by',

	Persona = 'persona',
	Province = 'province',
	Town = 'town',
	// Barrio = 'barrio',
	Barrios = 'barrios',
	// Type = 'type',
	Types = 'types',
	Keyword = 'keyword',
	Popular = 'popular',

	TimeTaken = 'time',
	TimeOfDay = 'tod',
	Price = 'price',
	Commitment = 'commitment',

	Children = 'children',
	Teenagers = 'teenagers',

	Daytrip = 'daytrip',
	Sundays = 'sundays',

	RequiresBooking = 'requires_booking',
	Seasonal = 'seasonal',

	PointOfInterest = 'poi',
	Landmark = 'landmark',

	Search = 'search',

	Exclude = 'exclude',
	Include = 'include',

	MoreLikeThis = 'more_like_this',
	LoadTrip = 'loadtrip',
	TripId = 'trip_id',
	Suggested = 'suggested', // whether or not the trip is a trip suggestion, else a user one
	Rating = 'rating',
	Zone = 'zone',
}
