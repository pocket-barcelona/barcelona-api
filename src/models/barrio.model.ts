import dynamoose from 'dynamoose';
import type { Item } from "dynamoose/dist/Item";

export interface BarrioInput {
  /** Unique ID number for the barrio */
  barrioId: number;
  /** The parent barrio to relate it to another. If zero, then the barrio is a parent. Ex. El Raval is in Ciutat Vella */
  parentId: number;
  /** The official barrio name, ex. in Catalan */
  officialName: string;
  /** The official barrio name, but without accents. Ex. Gràcia => Gracia */
  officialNameAccentless: string;
  /** The friendly URL for the barrio */
  urlSlug: string;
  /** Metro zone for the barrio. Most are 1 */
  barrioZone: number;
  /** A measure of how central the barrio is: 1=central ex. Ciutat Vella, 5=not central ex. Sarria Sant Gervasi, 10=not even in BCN */
  barrioCentrality: number;
}

export interface BarrioDocument extends BarrioInput, Item {
  createdAt: Date;
  updatedAt: Date;
}

const barrioSchema = new dynamoose.Schema({
  barrioId: {
    type: Number,
    required: true,
    hashKey: true,
  },
  parentId: {
    type: Number,
    required: true,
  },
  officialName: {
    type: String,
    required: true,
    default: '',
  },
  officialNameAccentless: {
    type: String,
    required: true,
    default: '',
  },
  urlSlug: {
    type: String,
    required: true,
    default: '',
  },
  barrioZone: {
    type: Number,
    required: true,
    default: 1,
  },
  barrioCentralityWeight: {
    type: Number,
    required: true,
    default: 5,
  },
}, {
  timestamps: true,
  saveUnknown: false,
});


export const TABLE_NAME_BARRIOS = 'Barrios';
const BarrioModel = dynamoose.model<BarrioDocument>(TABLE_NAME_BARRIOS, barrioSchema);

export default BarrioModel;
