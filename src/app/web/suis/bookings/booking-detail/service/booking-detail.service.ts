import { Injectable } from '@angular/core';
import {Booking} from '../../../models/booking.model';
import {Headers, Http, RequestMethod, RequestOptions} from '@angular/http';
import {MenuItem} from 'primeng/components/common/MenuItem';

@Injectable()
export class BookingDetailService {
  headers: Headers;
  options: RequestOptions;
  activeIndex = 0;
  stepItems: MenuItem[] = this.stepItems = [
    {label: 'Booking Details'},
    {label: 'Container Details'},
    ];

  constructor(private http: Http) {
    this.headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
    this.options = new RequestOptions({method: RequestMethod.Post, headers: this.headers});
  }

  getStepItems(){
    return this.stepItems;
  }

  addStepItem(stepItem: MenuItem) {
    this.stepItems.push(stepItem);
  }

  removeLastStepItem() {
    this.stepItems.pop();
  }
}
