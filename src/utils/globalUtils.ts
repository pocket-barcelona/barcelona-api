/**
 * Build the map link based on location accuracy
 * If lat/lng accurate, do this: https://maps.google.com/?q=42.346646,1.9572331
 * If not, do this: https://maps.google.com/?q=Ciutadella%20Park
 *
 * @url See also: https://stackoverflow.com/questions/1801732/how-do-i-link-to-google-maps-with-a-particular-longitude-and-latitude/52943975#52943975
 */
export function buildGoogleMapsLocationString(event: {
	lat: number;
	lng: number;
	// location: string;
}): string {
	if (!event.lat || !event.lng) {
		return '';
	}
	// https://www.google.com/maps/search/?api=1&query=<lat>,<lng>
	// Ex: https://www.google.com/maps/search/?api=1&query=41.37903407143937,2.1742959490764666
	// Ex: https://www.google.com/maps/search/?api=1&query=Poblenou%20Neighbourhood
	let mapStr = 'https://www.google.com/maps/search/?query=';

	// https://www.google.com/maps/search/?api=1&query=28.6139,77.2090
	// https://www.google.com/maps/search/?api=1&query=41.4134488,2.0182425&query_place_id=Molins%20de%20Rei

	// check accuracy
	// if (event.location_accuracy === 1) {
	//   mapStr += `${event.lat},${event.lng}`;
	// } else {
	//   mapStr += encodeURIComponent(event.location);
	// }

	// currently, lat/lng is handled in Google Sheets
	mapStr += `${event.lat},${event.lng}`;
	mapStr += '&api=1';
	// mapStr += ",16z"; // this doesn't work
	return mapStr;
}
