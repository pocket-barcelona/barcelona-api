import { getListHandler, getByIdHandler } from "./functions";
export class GuidesService {
  static getList = async () => getListHandler();
  
  static getById = async () => getByIdHandler();
}
