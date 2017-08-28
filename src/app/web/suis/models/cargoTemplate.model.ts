import {Commodity} from './commodity.model';

export class CargoTemplate {
  public id: number;
  public cargoTypeCode: string;
  public description: string;
  public htsId: number;
  public commodity: Commodity;
  constructor() {}
}
