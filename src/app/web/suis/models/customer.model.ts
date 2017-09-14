import {BaseCustomer} from './baseCustomer.model';
import {City} from './city.model';

export class Customer extends BaseCustomer {
  public taxId: string;
 public address: string;
 public city: City;
 public zipCode: string;
 public personInCharge: string;
 public email: string;
 public phone: string;

 constructor() {
   super();

 }
}
