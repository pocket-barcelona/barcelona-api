export type GooglePlacesFeature = {
	geometry: {
		coordinates: [number, number];
		type: 'Point';
	};
	properties: {
		/** Like: "2025-08-22T10:28:39Z" */
		date: string;
		/** Like: http://maps.google.com/?cid=2262057248650086919 */
		google_maps_url: string;
		location: {
			address: string;
			/** Like ES */
			country_code: string;
			/** Like 4 Latas Poblenou */
			name?: string;
		};
	};
	type: 'Feature';
};
export type GooglePlacesJsonType = {
	type: string;
	features: GooglePlacesFeature[];
};
