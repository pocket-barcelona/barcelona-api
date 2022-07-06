// CSV headers
// place_id,
// province_id,
// place_town,
// barrio_id,
// type_id,
// place_label,
// place (used for folder name),
// place_alias,
// place_remarks,
// place_desc,
// place_time,
// place_tod,
// place_commitment,
// place_price,
// place_children,
// place_teenagers,
// place_popular,
// place_boost,
// place_annual_only,
// place_seasonal,
// place_daytrip,
// place_daily,
// place_sundays,
// place_landmark,
// place_requires_booking,
// place_active,
// place_zone,
// place_latlng_accurate,
// place_lat,
// place_lng,
// place_zoom,
// place_website,
// place_related_id,
// place_internal,
// place_has_image,
// place_tags

export type PlacesCsv = {
  place_id: number | string;
  province_id: number | string;
  place_town: string;
  barrio_id: number | string;
  type_id: number | string;
  place_label: string;
  place: string;
  place_alias: string;
  place_remarks: string;
  place_desc: string;
  place_time: string;
  place_time_enum: number | string;
  place_tod: string;
  place_tod_enum: number | string;
  place_commitment: number | string;
  place_physical: number | string;
  place_price: number | string;
  place_free_visit: number | string;
  place_children: number | string;
  place_teenagers: number | string;
  place_popular: number | string;
  place_boost: number | string;
  place_annual_only: number | string;
  place_seasonal: number | string;
  place_daytrip: number | string;
  place_daily: number | string;
  place_sundays: number | string;
  place_landmark: number | string;
  place_requires_booking: number | string;
  place_active: number | string;
  place_zone: number | string;
  place_latlng_accurate: number | string;
  place_lat: number | string;
  place_lng: number | string;
  place_zoom: string;
  place_website: string;
  place_related_id: number | string;
  place_has_image: number | string;
  place_photo_ownership: number | string;
  place_tags: string;
  place_check: string;
}
