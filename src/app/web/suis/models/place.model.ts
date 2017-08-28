import {PlaceBase} from './placeBase.model';

export class Place extends PlaceBase {

  public brokerageRate: number;
  public code: string;
  public countryCode: string;
  public portStateCode: string;
  public typeId: number;
  public unCode: string;
 constructor() {
    super();
  }
}
