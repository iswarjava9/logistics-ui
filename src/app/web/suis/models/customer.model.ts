import {BaseCustomer} from './baseCustomer.model';

export class Customer extends BaseCustomer {
 public address: string;
 public ams2OpsController: string;
 public city: string;
 public countryCode: string;
 public stateCode: string;
 public street: string;
 public type: string;
 public zipCode: string;
 public clientId: number;
 public contactId: number;
 public industryId: number;

 constructor() {
   super();

 }
}
