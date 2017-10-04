import { ConfigService } from './../../../services/config.service';
import { isNullOrUndefined } from 'util';
import { BookingService } from './../booking/service/booking.service';
import { Injectable } from '@angular/core';
import {Booking} from '../../../models/booking.model';
import {Headers, Http, RequestMethod, RequestOptions} from '@angular/http';
import {MenuItem} from 'primeng/components/common/MenuItem';

@Injectable()
export class BookingDetailService{
  HOST = '';
  headers: Headers;
  options: RequestOptions;
  activeIndex = 0;
  stepItems: MenuItem[] = [
    {label: 'Booking Details'},
    {label: 'Container Details'},
    ];

  constructor(private http: Http, private bookingSvc: BookingService, private configSvc: ConfigService) {
    this.headers = new Headers({'Content-Type': 'application/json; charset=UTF-8'});
    this.options = new RequestOptions({method: RequestMethod.Post, headers: this.headers});
    this.HOST = configSvc.getConfiguration().baseUrl;
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

  refreshStepItems(bookingDetails: Booking) {
    if((isNullOrUndefined(bookingDetails)
             || isNullOrUndefined(bookingDetails.bookingStatus) 
             || (bookingDetails.bookingStatus != 'CONFIRMED')) 
                    && this.getStepItems().length > 2){
      this.removeLastStepItem();
    }else if(!isNullOrUndefined(bookingDetails) 
                          && (!isNullOrUndefined(bookingDetails.bookingStatus)) 
                          && (bookingDetails.bookingStatus === 'CONFIRMED')
                          && this.getStepItems().length <3){
      this.addStepItem({label:'B/L'});
    }
  }

  generateInvoice(booking): any {
       return this.http.post(this.HOST + '/logistics/booking/invoice', booking, this.options );
  }
}
