import {Component, enableProdMode, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {SelectItem} from 'primeng/primeng';

import {BookingInfo} from '../../models/bookinglist/bookingInfo.model';
import {BookingListService} from './service/booking-list.service';
import {DateHelper} from '../../util/dateHelper';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css'],
  providers: [BookingListService]
})
export class BookingListComponent implements OnInit {

  disableScreen = false;
  bookings: BookingInfo[];

  selectedBooking: BookingInfo;
  displayBookingDialog: boolean;
  newBooking: boolean;
  booking: BookingInfo;

  selectedID: number;

  statusList: SelectItem[];

  colors: SelectItem[];

  dateFilter: number;

  constructor(private router: Router, private bookingListSvc: BookingListService) {}

  ngOnInit() {
      this.disableScreen = true;
    this.bookingListSvc.getBookingList().
    subscribe(
      (res: any) => {
        const body = res.json();
        DateHelper.convertDateStringsToDates(body);
        this.bookings = res.json();
        console.log(res.json());
          this.disableScreen = false;
        },
        (error) => {
            this.disableScreen = false;
        });
    /* this.bookings = this.bookingListSvc.getUpdatedList();*/
    this.statusList = [];
    this.statusList.push({label: 'All Statuses', value: null});
       
    this.statusList.push({label: 'Advanced', value: 'ADVANCED'});
    this.statusList.push({label: 'Cancelled', value: 'CANCELLED'});
    this.statusList.push({label: 'Confirmed', value: 'CONFIRMED'});
    
  }
  createNewBooking() {
    this.router.navigate(['/booking-detail']);
  }

  handleBookingSelection(event) {
    console.log(event.data.id);
    this.selectedID = event.data.id;
    this.newBooking = false;
    // this.car = this.cloneCar(event.data);
    this.displayBookingDialog = true;
  }

  delete() {

  }
  updateBooking(event) {
    this.router.navigate(['/booking-detail', this.selectedID]);

  }
 }
