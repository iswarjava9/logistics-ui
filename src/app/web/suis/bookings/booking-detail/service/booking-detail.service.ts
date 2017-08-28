import { Injectable } from '@angular/core';
import {Booking} from '../../../models/booking.model';
import {Headers, Http, RequestMethod, RequestOptions} from '@angular/http';

@Injectable()
export class BookingDetailService {
  headers: Headers;
  options: RequestOptions;

  constructor(private http: Http) {


    this.headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
    this.options = new RequestOptions({method: RequestMethod.Post, headers: this.headers});
  }


}
