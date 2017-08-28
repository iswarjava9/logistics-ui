import { Injectable } from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {BookingShortInfo} from '../../../models/bookingShortInfo.model';
import {BookingInfo} from '../../../models/bookinglist/bookingInfo.model';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class BookingListService {
  headers: Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append('Accept', 'application/json');
  }


  getBookingList(): any {
    return this.http.get('http://localhost:8080/logistics/booking/list', this.headers);
  }


}
