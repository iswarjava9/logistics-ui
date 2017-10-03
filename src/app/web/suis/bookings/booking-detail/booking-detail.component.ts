import { isNullOrUndefined } from 'util';
import { BookingService } from './booking/service/booking.service';
import { Event } from '@angular/router';
import { BookingDetailService } from './service/booking-detail.service';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {MenuItem} from 'primeng/components/common/MenuItem';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BookingDetailComponent implements OnInit {

  activeIndex = 0;
  constructor(private bookingDetailSvc: BookingDetailService, private bookingSvc: BookingService){}
  ngOnInit() {
  
   }

  changeBookingDetailsView(event: Event) {

    console.log(event);
  }


  onChange(step: number){
    this.activeIndex = step;
 
  }

  getBookingDetails(){
    return this.bookingSvc.bookingDetails;
  }
}
