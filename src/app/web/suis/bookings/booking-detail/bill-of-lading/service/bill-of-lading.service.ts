import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import { Injectable } from '@angular/core';

import { ConfigService } from './../../../../services/config.service';
import { BookingService } from './../../booking/service/booking.service';

import { isNullOrUndefined } from 'util';
import { Booking } from './../../../../models/booking.model';
import { BillOfLading } from './../../../../models/billOfLading.model';
import { City } from './../../../../models/city.model';
import { Person } from './../../../../models/person.model';
import { Place } from './../../../../models/place.model';
import { Customer } from './../../../../models/customer.model';


@Injectable()
export class BillOfLadingService {
  private headers: Headers = new Headers();
  private options: RequestOptions;
  HOST = '';
  constructor(private http: Http, private configSvc: ConfigService, private bookingSvc: BookingService) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    this.HOST = configSvc.getConfiguration().baseUrl;
  }
  getBillOfLading(blId: number): any {
    this.headers = new Headers();
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    return this.http.get( this.HOST + '/logistics/billoflading/' + blId,this.options);
  }

  saveBillOfLading(billoflading): any {
    this.headers = new Headers();
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    return this.http.post(this.HOST + '/logistics/billoflading', billoflading, this.options);
  }

  updateBillOfLading(billoflading): any {
    this.headers = new Headers();
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    return this.http.put(this.HOST + '/logistics/billoflading', billoflading, this.options);
  }

  getBillOfLadingPdf(bLId) {
    const headers = new Headers({
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf',
      
  });
     this.options = new RequestOptions({headers: headers});;
     this.options.responseType = ResponseContentType.Blob;// Set responseType to Blob
    return this.http.get(this.HOST + '/logistics/billoflading/download/' + bLId,  this.options);
    }

    copyBookingToHBL(booking: Booking, billOfLading: BillOfLading ): BillOfLading {
      // const booking = this.bookingSvc.getBookingDetails();
    //  let billOfLading = new BillOfLading();
      billOfLading.blNo = booking.forwarderRefNo;
      billOfLading.carrierRefNo = booking.carrierBookingNo;
      billOfLading.cosolidationNo = booking.forwarderRefNo;
      billOfLading.shipper = this.getCustomerString(booking.shipper);
      billOfLading.consignee = this.getCustomerString(booking.consignee);
      billOfLading.delieveryAgent = this.getCustomerString(booking.deliveryAgent);
      billOfLading.forwardingAgent = this.getCustomerString(booking.bookingAgent);
      billOfLading.notify = this.getCustomerString(booking.notify1);
      billOfLading.ingateAtTerminal = this.getPlaceString(booking.ingateAtTerminal);
      billOfLading.placeOfDelivery = this.getPlaceString(booking.placeOfDelivery);
      billOfLading.placeOfReceipt = this.getPlaceString(booking.placeOfReceipt);
      billOfLading.portOfDischarge = this.getPlaceString(booking.portOfDischarge);
      billOfLading.portOfLoad = this.getPlaceString(booking.portOfLoad);
  
      billOfLading.shipperRef = booking.shipperRefNo;
      if(isNullOrUndefined(booking.vessel)){
        billOfLading.vesselVoyage = null;
      }else{
        billOfLading.vesselVoyage = booking.vessel.name;
      }
      billOfLading.bookingDetail = booking;
      return billOfLading;
   }

   appendStrings(primaryStr: string, secondaryStr: string){
    let resultString = '';
    if(!isNullOrUndefined(primaryStr)){
      resultString = primaryStr;
      if(!isNullOrUndefined(secondaryStr)){
        resultString = resultString + secondaryStr;
      }
    }
    return resultString;
  }

  getCityAddress(city: City){
    let cityAddress = '';
    if(!isNullOrUndefined(city)){
      cityAddress = this.appendStrings(city.name, '\n')
                                          + this.appendStrings(city.stateName, city.countryName);
      }
      return cityAddress; 

  }
  getCustomerString(customer: Customer){
    let customerString = null;
    if(!isNullOrUndefined(customer)){
      customerString = this.appendStrings(customer.name, '\n') 
                                          + this.appendStrings(customer.address,'\n') 
                                          + this.getCityAddress(customer.city);
      }
      return customerString;
  }
  getPlaceString(place: Place){
    let placeString = null;
    if(!isNullOrUndefined(place)){
      placeString = this.appendStrings(place.name, '\n') 
                                          + this.appendStrings(place.address,'\n') 
                                          + this.getCityAddress(place.city);
      }
      return placeString;
  }
  getPersonString(person: Person){
    let personString = null;
    if(!isNullOrUndefined(person)){
      personString = this.appendStrings(person.name, '\n') 
                                          + this.appendStrings(person.name, '\n') 
                                          + this.appendStrings(person.email, '\n')
                                          + this.appendStrings('Phone:', person.phone)
                                          + this.appendStrings('\nMobile:', person.mobile);
      }
      return personString;
  
}
addOrUpdateBL(billOfLading: BillOfLading) {
  const billOfLadingString = this.bookingSvc.removeTimeZoneFromBillOfLading(billOfLading);
  if(isNullOrUndefined(billOfLading.id)){
    this.saveBillOfLading(billOfLadingString).subscribe(
      (response) => {
        console.log('Bill of lading saved');
        // this.billOfLading = response.json();
        // this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
        
        // console.log(response.json());
        // this.billOfLading.bookingDetail =this.bookingSvc.getBookingDetails();
         // this.print(this.bookingSvc.removeTimeZoneFromObject(this.billOfLading));
      }
    );
  }else{
    this.updateBillOfLading(billOfLadingString).subscribe(
      (response) => {
        console.log('Bill of lading updated');
        // this.billOfLading = response.json();
        
        // console.log(response.json());
         // this.print(this.bookingSvc.removeTimeZoneFromObject(this.billOfLading));
      }
    );
  }
}
}
