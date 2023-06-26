import BarrioModel, { BarrioDocument } from "../../../models/barrio.model";

/**
 * Upload an image to S3
 * @returns
 */
export default async function (file: any): Promise<boolean> {
  // try {
  //   const parentIdField: keyof BarrioDocument = "parentId";

  //   // support for top-level barrios, where parentId is undefined

  //   const result = BarrioModel.scan()
  //     .where(parentIdField)
  //     .eq(0)
  //     .exec(); // this will scan every record
  //   return await result.catch((err) => {
  //     // logger.warn(err)
  //     return null;
  //   });
  // } catch (e) {
  //   return null;
  // }
  return true;
}
