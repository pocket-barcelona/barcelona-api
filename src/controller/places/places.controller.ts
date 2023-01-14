import { Request, Response } from "express";
import { ReadPlaceInput } from "../../schema/place/place.schema";
import { getList, getById, getRelatedPlaces, getPlaceCategories } from './handlers';

export class PlacesController {

  static getListHandler = (req: Request, res: Response) => getList(req, res);

  static getByIdHandler = (req: Request<ReadPlaceInput['params']>, res: Response) => getById(req, res);

  static getRelatedPlacesHandler = (req: Request<ReadPlaceInput['params']>, res: Response) => getRelatedPlaces(req, res);
  
  static getPlaceCategoriesHandler = (req: Request, res: Response) => getPlaceCategories(req, res);
}
