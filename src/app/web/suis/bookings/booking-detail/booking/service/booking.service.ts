import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Booking} from '../../../../models/booking.model';
import {Customer} from '../../../../models/customer.model';
import {Place} from '../../../../models/place.model';
import {BusinessLine} from '../../../../models/businessLine.model';
import {Division} from '../../../../models/division.model';
import {MovementType} from '../../../../models/movementType.model';
import {Person} from '../../../../models/person.model';
import {Vessel} from '../../../../models/vessel.model';


@Injectable()
export class BookingService {
  headers: Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');

  }


  getBooking(bookingId: number): any {
    return this.http.get('http://localhost:8080/logistics/booking/' + bookingId, this.headers);
  }

  saveBooking(booking): any {

    return this.http.post('http://localhost:8080/logistics/booking', booking, this.headers );
  }

  getPlaces(query: string) {
    return this.http.get('http://localhost:8080/logistics/place/byname/'  + query, this.headers);
  }

  getCustomers(query: string) {
    return this.http.get('http://localhost:8080/logistics/customer/byname/'  + query, this.headers);
  }

  getPersons() {
    return this.http.get('http://localhost:8080/logistics/person/list', this.headers);
  }

  getClients() {
    return this.http.get('http://localhost:8080/logistics/client/list', this.headers);
  }

  getBusinessLines() {
    return this.http.get('http://localhost:8080/logistics/businessline/list', this.headers);
  }

  getVessels() {
    return this.http.get('http://localhost:8080/logistics/vessel/list', this.headers);
  }
  getMovementTypess() {
    return this.http.get('http://localhost:8080/logistics/movementtype/list', this.headers);
  }
  getDivisions() {
    return this.http.get('http://localhost:8080/logistics/division/list', this.headers);
  }

  savePlace(place: Place): any {
    return this.http.post('http://localhost:8080/logistics/place', place, this.headers );
  }
  saveCustomer(customer: Customer): any {
    return this.http.post('http://localhost:8080/logistics/customer', customer, this.headers );
  }
  saveBusinessLine(businessLine: BusinessLine): any {
    return this.http.post('http://localhost:8080/logistics/businessline', businessLine, this.headers );
  }
  saveDivision(division: Division): any {
    return this.http.post('http://localhost:8080/logistics/division', division, this.headers );
  }
  saveMovementType(movementType: MovementType): any {
    return this.http.post('http://localhost:8080/logistics/movementtype', movementType, this.headers );
  }
  savePerson(person: Person): any {
    return this.http.post('http://localhost:8080/logistics/person', person, this.headers );
  }

  saveVessel(vessel: Vessel): any {
    return this.http.post('http://localhost:8080/logistics/person', vessel, this.headers );
  }
  getPDF(id: number): any {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
      });
      const options = new RequestOptions({ headers: headers });
// Ensure you set the responseType to Blob.
      options.responseType = ResponseContentType.Blob;

      return this.http.get('http://localhost:8080/logistics/booking/download/' + id, options);
  }
}
