import { DateHelper } from './../../../../util/dateHelper';
import { Booking } from './../../../../models/booking.model';
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Customer} from '../../../../models/customer.model';
import {Place} from '../../../../models/place.model';
import {BusinessLine} from '../../../../models/businessLine.model';
import {Division} from '../../../../models/division.model';
import {MovementType} from '../../../../models/movementType.model';
import {Person} from '../../../../models/person.model';
import {Vessel} from '../../../../models/vessel.model';
import { Message } from 'primeng/components/common/message';


@Injectable()
export class BookingService {
  public activeIndex = 0;
  public bookingDetails: Booking;
  msgsGrowl: Message[] = [];

  headers: Headers = new Headers();
  private options: RequestOptions ;
  HOST = 'http://localhost:8080';
  constructor(private http: Http) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});

  }
updateBooking(bookig: Booking){
  this.bookingDetails = bookig;
}
updateMessages(message: Message){
  this.msgsGrowl.push(message);
}

getMessages(){
  return this.msgsGrowl;
}

clearMessages(){
  return this.msgsGrowl = [];
}
getBookingId(){
  return this.bookingDetails.id;
}
getBookingDetails(){
  return this.bookingDetails;
}
  getBooking(bookingId: number): any {
    return this.http.get( this.HOST + '/logistics/booking/' + bookingId,this.options);
  }

  saveBooking(booking): any {

    return this.http.post(this.HOST + '/logistics/booking', booking, this.options );
  }

  modifyBooking(booking): any {
      return this.http.put(this.HOST + '/logistics/booking', booking, this.options );
  }

  getPlaces(query: string) {
    return this.http.get(this.HOST + '/logistics/place/byname/'  + query, this.options);
  }

  getCustomers(query: string) {
    return this.http.get(this.HOST + '/logistics/customer/byname/'  + query, this.options);
  }

  getPersons(query: string) {
    return this.http.get(this.HOST + '/logistics/person/byname/' + query, this.options);
  }

  getClients() {
    return this.http.get(this.HOST + '/logistics/client/list', this.options);
  }

  getBusinessLines() {
    return this.http.get(this.HOST + '/logistics/businessline/list', this.options);
  }

  getVessels(query: string) {
    return this.http.get(this.HOST + '/logistics/vessel/byname/' + query, this.options);
  }
  getMovementTypess() {
    return this.http.get(this.HOST + '/logistics/movementtype/list', this.options);
  }
  getDivisions(query: string) {
    return this.http.get(this.HOST + '/logistics/division/byName' + query, this.options);
  }


  getCities(query: string) {
    return this.http.get(this.HOST + '/logistics/region/city/byname/' + query, this.options);
  }
  savePlace(place: Place): any {
     this.headers.append('observe', 'response');
      this.options = new RequestOptions({headers: this.headers});
    return this.http.post(this.HOST + '/logistics/place', place, this.options  );
  }
  saveCustomer(customer: Customer): any {
    return this.http.post(this.HOST + '/logistics/customer', customer, this.options );
  }
  saveBusinessLine(businessLine: BusinessLine): any {
    return this.http.post(this.HOST + '/logistics/businessline', businessLine, this.options );
  }
  saveDivision(division: Division): any {
    return this.http.post(this.HOST + '/logistics/division', division, this.options );
  }
  saveMovementType(movementType: MovementType): any {
    return this.http.post(this.HOST + '/logistics/movementtype', movementType, this.options );
  }
  savePerson(person: Person): any {
    return this.http.post(this.HOST + '/logistics/person', person, this.options );
  }

  saveVessel(vessel: Vessel): any {
    return this.http.post(this.HOST + '/logistics/vessel', vessel, this.options );
  }
  getPDF(id: number): any {
      const headers = new Headers({
          'Content-Type': 'application/pdf',
          'Accept': 'application/pdf',
          
      });
      
      const options = new RequestOptions({ headers: headers });
// Ensure you set the responseType to Blob.
      options.responseType = ResponseContentType.Blob;

      return this.http.get(this.HOST + '/logistics/booking/download/' + id, options);
  }

  getTimeZones(){
    return this.http.get(this.HOST + '/logistics/region/timezones' , this.options);
  }

  removeTimeZoneFromBooking(booking: Booking){ 
    let jsonString = JSON.stringify(booking);
    console.log('json String:' + jsonString);
    jsonString = JSON.parse(jsonString);
    DateHelper.removeTimeAndTimeZone(jsonString);
    return jsonString;
  }
}
