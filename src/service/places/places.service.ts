import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument } from "../../models/place.model";
import { getListHandler, getByIdHandler, getRelatedPlacesHandler, getPlaceCategoriesHandler } from './functions';
import { CategoryDocument } from '../../models/category.model';
import { ImageAssetsSize } from '../../models/imageAssets';
import { ReadPlaceInput } from '../../schema/place/place.schema';

export class PlacesService {

  static getList = async (): Promise<ScanResponse<PlaceDocument> | null> => getListHandler();
  
  static getById = async (placeId: PlaceDocument['placeId']): Promise<PlaceDocument | null> => getByIdHandler(placeId);

  static getRelatedPlaces = async (placeParams: ReadPlaceInput['params']): Promise<ScanResponse<PlaceDocument> | null> => getRelatedPlacesHandler(placeParams);
  
  static getPlaceCategories = async (): Promise<ScanResponse<CategoryDocument> | null> => getPlaceCategoriesHandler();

  static getMappedPlaceDocuments = (places: PlaceDocument[]): Partial<PlaceDocument>[] => {
    return places.map((p) => {
      return PlacesService.getMappedPlace(p);
    });
  }

  static getMappedPlace = (place: PlaceDocument): Partial<PlaceDocument> => {
    // build images
    const sizes: ImageAssetsSize[] = ['thumb', 'medium', 'large'];
    const images: PlaceDocument['images'] = sizes.map(s => {
      const poster = PlacesService.getPoster(place, s);
      return {
        size: s,
        url: poster,
      }
    });

    const rating: PlaceDocument['rating'] = PlacesService.getPlaceRating(place);

    return {
      ...place,
      images,
      rating,
    };
  }

  static getPoster (place: PlaceDocument, size: ImageAssetsSize): string {
    // online
		// https://s3.eu-west-3.amazonaws.com/barcelonasite/images/places/6_stand_up_paddleboarding_sup/paddleboarding-1973035.jpg
		// local
		// http://127.0.0.1/Barcelona_Barrios_And_Places/Places/6_stand_up_paddleboarding_sup/paddleboarding-1973035.jpg
		
		// local medium
		// http://127.0.0.1/Barcelona_Barrios_And_Places/Places/_posters/medium/[ID]_poster.jpg

    const noImagePoster = 'https://s3.eu-west-3.amazonaws.com/barcelonasite/images/assets/placeholder-image.jpg';
    if (!place.hasImage) return noImagePoster;

    const path = `https://s3.eu-west-3.amazonaws.com/barcelonasite/images/places/_posters/${size}/${place.placeId}_poster.jpg`;
		return path;
  }

  static getPlaceRating(place: PlaceDocument): PlaceDocument['rating'] {
    const placeRating: PlaceDocument['rating'] = {
      'rating': '0',
      'ratingIndex': 0,
      'ratingStars': [],
    };

    let rating = 3;

    if (place.popular) {
      rating += 1;
    }

    if (place.boost) {
      // @todo - round to 1 dp
      rating += Math.round(place.boost / 100);
    }

    placeRating.rating = rating.toFixed(1);
    
    placeRating.ratingIndex = (place.popular ? 1 : 0) + place.boost;

    const stars: string[] = [];
    for (let index = 0; index < 5; index++) {
      if (rating <= index) {
        stars.push('none');
      } else if(rating >= (index + 1)) {
        stars.push('full');
      } else {
        stars.push('half');
      }
    }

    placeRating.ratingStars = [...stars];
    return placeRating;
  }
  
}
