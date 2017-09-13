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

  stepItems: MenuItem[];
  activeIndex = 0;
  constructor(private bookingSvc: BookingDetailService){}
  ngOnInit() {
    this.stepItems = [
      {label: 'Booking Details'},
      {label: 'Container Details'},
      {label: 'Charge Details'}
    ];
   }

  changeBookingDetailsView(event: Event) {

    console.log(event);
  }

  nextActiveIndex(){
    // this.activeIndex++;
  }
  onChange(step: number){
    this.activeIndex = step;
    console.log('OnChange...' + step);
    // this.changeBookingDetailsView(step);
  }
}
