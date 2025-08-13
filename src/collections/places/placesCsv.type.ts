/** This type should match the CSV headers in Google Sheets */
export type PlacesCsv = {
	placeId: number | string;
	provinceId: number | string;
	/** skipped */
	// province: string;
	placeTown: string;
	barrioId: number | string;
	/** skipped */
	// barrio: string;
	categoryId: number | string;
	/** skipped */
	// type: string;
	active: number | string;
	hasImage: number | string;
	labelCat: string;
	labelEsp: string;
	labelEng: string;
	// place: string;
	slug: string;
	remarks: string;
	description: string;
	// timeRecommended: string;
	timeRecommendedEnum: number | string;
	// bestTod: string;
	bestTodEnum: number | string;
	commitmentRequiredEnum: number | string;
	priceEnum: number | string;
	freeToVisit: number | string;
	childrenSuitability: number | string;
	teenagersSuitability: number | string;
	touristAttraction: number | string;
	popular: number | string;
	boost: number | string;
	annualOnly: number | string;
	seasonal: number | string;
	daytrip: number | string;
	availableDaily: number | string;
	/** @deprecated */
	availableSundays: number | string;
	requiresBooking: number | string;
	metroZone: number | string;
	/** 1 or 0 */
	isLandmark: number | string;
	/** @deprecated */
	isPhysicalLocation: number | string;
	lat: number | string;
	lng: number | string;
	latLngAccurate: number | string;
	mapZoom: number | string;
	website: string;
	relatedPlaceId: number | string;
	photoOwnership: number | string;
	tags: string;
	/** 1=info by PB, 0=info by people */
	placeInternal: number;
};
