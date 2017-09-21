import { ConfigService } from './../../../services/config.service';
import { AuthService } from './../../../shared/auth/auth.service';
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {BookingShortInfo} from '../../../models/bookingShortInfo.model';
import {BookingInfo} from '../../../models/bookinglist/bookingInfo.model';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class BookingListService {
  headers: Headers = new Headers();
  options: RequestOptions;
  HOST = '';

  constructor(private http: Http, private auth: AuthService, private configSvc: ConfigService) {
    this.headers.append('Accept', 'application/json');
    this.HOST = configSvc.getConfiguration().baseUrl;
  }


  getBookingList(): any {
    this.headers.append('authorization', localStorage.getItem('id_token'));
    this.options = new RequestOptions({headers: this.headers});
    return this.http.get(this.HOST + '/logistics/booking/list', this.options);
  }


}
