import { TravelModesEnum } from '../enums/travelmodes.enum';

/** Example: http://localhost:8080/poi?category=coworking */
export class PoiModel {
  poi_id: number;
  poi_cat_id: number;
  poi_subcat_id: number;
  poi_name: string;
  poi_desc: string;
  poi_address: string;
  poi_lat: number;
  poi_lng: number;
  poi_lat_lng: string; // like "41.398701,2.19551"
  poi_price: number; // replace with enum
  poi_price_frequency: number; // replace with enum
  poi_website: string;
  poi_email: string;
  poi_tel: string;
  poi_created: Date;
  poi_modified: Date;

  barrio_id: number;
  barrio: string;
  barrio_label: string;
}


export type PlacesCsv {
  place_id: number;
  province_id: number;
  province: string;
  province_alias: string;
  place_town: string;
  barrio_id: number;
  barrio_parent_id: number;
  barrio_parent_label: string; // can be in Spanish and contain accents etc
  barrio_parent: string;
  barrio_parent_alias: string; // will be like '/ciutat_vella'
  barrio_parent_desc: string;
  barrio_label: string; // can be in Spanish and contain accents etc
  barrio: string;
  barrio_desc?: string;
  type_id: number;
  type_label: string;
  type_icon: string;
  type_visited_by: string;
  place_label: string;
  place: string;
  /**
   * @description place alias is the name of the link with the slash
   */
  place_alias: string;
  /**
   * @description place alias name is the name of the link without the slash
   */
  place_alias_name: string;
  place_remarks: string;
  place_desc: string;
  place_desc_full?: string;
  place_time: number;
  place_tod: number;
  place_commitment: number;
  place_price: number;
  place_price_range: number;
  // place_has_photo: number;
  place_children: number;
  place_teenagers: number;
  place_popular: boolean;
  place_popularity: number;
  place_boost: number;
  place_annual_only: number;
  place_seasonal: number;
  place_daily: number;
  place_sundays: number;
  place_landmark: number;
  place_requires_booking: number;

  // place_active: number;
  place_zone: number;
  place_latlng_accurate: number;
  place_lat: number;
  place_lng: number;
  place_lat_lng: string;
  place_zoom: number;
  place_website: string;
  place_posters: {
    thumb: string;
    small: string;
    medium: string;
    large: string;
  };

  place_rating: any;

  place_distance: number;
  place_distance_walking: string;
  place_distance_mode?: TravelModesEnum;

}