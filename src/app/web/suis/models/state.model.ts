import {Country} from './country.model';
export class State {
  public id: number;
  public code: string;
  public name: string;
  public country: Country;

  constructor() {}
}
