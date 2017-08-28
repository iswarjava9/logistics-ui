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
}
