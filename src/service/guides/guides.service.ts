import { getListHandler } from "./functions";
export class GuidesService {
  static getList = async (): Promise<any> => getListHandler();
}
