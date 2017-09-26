import { forEach } from '@angular/router/src/utils/collection';
import { MessageService } from 'primeng/components/common/messageservice';
import { BookingService } from './../booking-detail/booking/service/booking.service';
import { BookingDetailService } from './../booking-detail/service/booking-detail.service';
import {Component, enableProdMode, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

import {DateHelper} from '../../util/dateHelper';

import {SelectItem} from 'primeng/primeng';
import { Message } from 'primeng/components/common/message';

import {BookingInfo} from '../../models/bookinglist/bookingInfo.model';
import {BookingListService} from './service/booking-list.service';



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
  msgsGrowl: Message[] = [];

  dateFilter: number;

  constructor(private router: Router, private bookingListSvc: BookingListService, private bookingSvc: BookingService, private msgSvc: MessageService) {}

  ngOnInit() {
    this.bookingSvc.getMessages().forEach(message => this.msgsGrowl.push(message));
      this.disableScreen = true;
    this.bookingListSvc.getBookingList().
    subscribe(
      (res: any) => {
        let bookingList: BookingInfo[] = [];
        let body = res.json();
        DateHelper.convertDateStrings(body);
        
        // DateHelper.removeTimeAndTimeZone(body);        
        this.bookings = body;
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
    this.router.navigate(['/booking-detail', {editable: true}]);
  }

  handleBookingSelection(event) {
    console.log(event.data.id);
    this.selectedID = event.data.id;
    this.newBooking = false;
    // this.car = this.cloneCar(event.data);
    this.displayBookingDialog = true;
  }

  cancelBooking(){

  }
  delete() {

  }
  updateBooking(bookingId: number) {
    this.router.navigate(['/booking-detail', {id: bookingId, editable: true}]);

  }

  viewBooking(bookingId: number) {
    this.router.navigate(['/booking-detail', {id: bookingId, editable: false}]);
  }
  
  print(bookingId: number) {
    this.disableScreen = true;
    this.bookingSvc.getPDF(bookingId).subscribe(
        (response: any) => {
            this.bookingSvc.printBookingConfirmation(response, bookingId);
            this.msgSvc.add({severity: 'success', summary: 'PDF Generation ', detail: 'Booking Confirmation PDF is generated.'});
            this.disableScreen = false;
        },
        error => {console.log(error);
            this.disableScreen = false;
            this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: ' Booking Confirmation pdf Creation Failed'});
            // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        },
        success => {
            this.disableScreen = false;
        }
    );
}
 }
