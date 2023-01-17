import { Request, Response } from "express";
import { ReadPlaceInput } from "../../schema/place/place.schema";
import { getList, getById, getRelatedPlaces, getPlaceCategories } from './handlers';
import { ReadExploreInput } from '../../schema/explore/explore.schema';

export class PlacesController {

  static getListHandler = (req: Request<any, any, any, ReadExploreInput['body']>, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadPlaceInput['params']>, res: Response) => getById(req, res);

  static getRelatedPlacesHandler = (req: Request<ReadPlaceInput['params']>, res: Response) => getRelatedPlaces(req, res);
  
  static getPlaceCategoriesHandler = (req: Request, res: Response) => getPlaceCategories(req, res);
}
