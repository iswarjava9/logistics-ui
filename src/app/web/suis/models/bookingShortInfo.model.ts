import {ShortInfo} from './metamodel/shortInfo.model';

export class BookingShortInfo {
  constructor(public id: number, public status: ShortInfo, public customer: ShortInfo, public type:  ShortInfo) {}
}
