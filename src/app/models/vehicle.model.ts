import {Brand} from "./brand.model";
import {Model} from "./model.model";

export class Vehicle {
  id!: number;
  modelYear!: number;
  brand!: Brand;
  model!: Model;
  vin!: string;
  price!: number;
}
