import { City } from './city.model';
import {PlaceBase} from './placeBase.model';

export class Place extends PlaceBase {
  public code: string;
  public timeZoneId: string;
  public country: string;
  public state: string;
  public city: City;
  public address: string;
  constructor() {
    super();
  }
}
