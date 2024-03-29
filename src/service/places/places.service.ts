import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { PlaceDocument, PlaceInput } from "../../models/place.model";
import {
  getListHandler,
  getByIdHandler,
  getRelatedPlacesHandler,
  getPlaceCategoriesHandler,
  getSearchPrepopulateHandler,
  getPlaceLookupHandler,
} from "./functions";
import { CategoryDocument } from "../../models/category.model";
import { ImageAssetsSize } from "../../models/imageAssets";
import { ReadPlaceInput } from "../../schema/place/place.schema";
import { ReadExploreInput } from "../../schema/explore/explore.schema";
import { PlaceSearchDocument } from "../../models/place-search.model";
import { PlaceLookupDocument } from '../../models/place-lookup.model';
// import 'dotenv/config'; // support for dotenv injecting into the process env

export class PlacesService {
  static getList = async (
    params: ReadExploreInput["body"]
  ): Promise<ScanResponse<PlaceDocument> | null> => getListHandler(params);

  static getById = async (
    placeId: PlaceDocument["placeId"]
  ): Promise<PlaceDocument | null> => getByIdHandler(placeId);

  static getRelatedPlaces = async (
    params: ReadPlaceInput["params"]
  ): Promise<ScanResponse<PlaceDocument> | null> =>
    getRelatedPlacesHandler(params);

  static getPlaceCategories =
    async (): Promise<ScanResponse<CategoryDocument> | null> =>
      getPlaceCategoriesHandler();

  static getSearchPrepopulate =
    async (): Promise<ScanResponse<PlaceSearchDocument> | null> =>
      getSearchPrepopulateHandler();
  
  /** This is for the Dashboard which needs a list of places and their IDs */
  static getPlaceLookupList =
      async (): Promise<ScanResponse<PlaceLookupDocument> | null> =>
        getPlaceLookupHandler();

  static getMappedPlaceDocuments = (places: PlaceDocument[]): PlaceInput[] => {
    return places.map((p) => {
      return PlacesService.getMappedPlace(p);
    });
  };

  /**
   * Add additional data to the place object, such as the province, images and ratings
   */
  static getMappedPlace = (place: PlaceDocument): PlaceInput => {
    // get province
    const province = PlacesService.getProvinceById(place.provinceId);

    // build images
    const sizes: ImageAssetsSize[] = ["thumb", "medium", "large"];
    const images: PlaceDocument["images"] = sizes.map((s) => {
      const poster = PlacesService.getPoster(place, s);
      return {
        size: s,
        url: poster,
      };
    });

    const rating: PlaceDocument["rating"] = PlacesService.getPlaceRating(place);

    return {
      ...place,
      images,
      rating,
      province,
    };
  };

  /** Build a trimmed down version of the places document */
  static getMappedSearchPlace = (places: PlaceDocument[]): PlaceSearchDocument[] => {
    return places.map(place => {
      return {
        placeId: place.placeId,
        nameEnglish: place.nameEnglish,
        nameOfficial: place.nameOfficial,
        nameOfficialAccentless: place.nameOfficialAccentless,
        description: place.description || '',
        urlSlug: place.urlSlug,
        tags: place.tags,
        barrioId: place.barrioId,
      };
    });
  };

  /** Build a trimmed down version of the places document */
  static getMappedLookupPlace = (places: PlaceDocument[]): PlaceLookupDocument[] => {
    return places.map(place => {
      return {
        placeId: place.placeId,
        nameOfficial: place.nameOfficial,
      };
    });
  };

  /**
   * Get the poster image for a place, given a certain size. If place is set to not have an image, return the placeholder image
   * @param place The place
   * @param size The size of the image required
   * @returns
   */
  static getPoster(place: PlaceDocument, size: ImageAssetsSize): string {
    const base = process.env.AWS_S3_BUCKET;
    const noImagePoster = `${base}/images/assets/placeholder-image.jpg`;
    if (!place.hasImage) return noImagePoster;

    const path = `${base}/images/places/_posters/${size}/${place.placeId}_poster.jpg`;
    return path;
  }

  /**
   * Build an easy to use rating stars object so the FE does not have to compute it
   */
  static getPlaceRating(place: PlaceDocument): PlaceDocument["rating"] {
    const placeRating: PlaceDocument["rating"] = {
      rating: "0",
      ratingIndex: 0,
      ratingStars: [],
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
        stars.push("none");
      } else if (rating >= index + 1) {
        stars.push("full");
      } else {
        stars.push("half");
      }
    }

    placeRating.ratingStars = [...stars];
    return placeRating;
  }

  /** Lookup a province name given its ID. If the place is not in Spain, return a fixed string */
  static getProvinceById(provinceId: PlaceDocument["provinceId"]): string {
    const exists = PlacesService.provincesLookup.find(
      (p) => p.id === provinceId
    );
    return exists ? exists.province : "Outside Spain";
  }

  /** List of provinces in Spain. The ID is ours and place data contains it */
  static readonly provincesLookup = [
    { id: 1, province: "Andalusia" },
    { id: 2, province: "Catalonia" },
    { id: 3, province: "Madrid" },
    { id: 4, province: "Valencia" },
    { id: 5, province: "Galicia" },
    { id: 6, province: "Castile and León" },
    { id: 7, province: "Basque Country" },
    { id: 8, province: "Canary Islands" },
    { id: 9, province: "Castile-La Mancha" },
    { id: 10, province: "Murcia" },
    { id: 11, province: "Aragón" },
    { id: 12, province: "Extremadura" },
    { id: 13, province: "Balearic Islands" },
    { id: 14, province: "Asturias" },
    { id: 15, province: "Navarre" },
    { id: 16, province: "Cantabria" },
    { id: 17, province: "La Rioja" },
    { id: 18, province: "Ceuta" },
    { id: 19, province: "Melilla" },
    { id: 20, province: "Alicante" },
    { id: 21, province: "Andorra" },
  ];
}
