import { City } from './../../../models/city.model';
import { BillOfLadingService } from './service/bill-of-lading.service';
import { format } from 'date-fns';
import { SelectItem } from 'primeng/primeng';
import { Person } from './../../../models/person.model';
import { Place } from './../../../models/place.model';
import { ForeignAgent } from './../../../models/foreignAgent.model';
import { Customer } from './../../../models/customer.model';
import { isNullOrUndefined } from 'util';
import { BillOfLading } from './../../../models/billOfLading.model';
import { BookingService } from './../booking/service/booking.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-bill-of-lading',
  templateUrl: './bill-of-lading.component.html',
  styleUrls: ['./bill-of-lading.component.css']
})
export class BillOfLadingComponent implements OnInit {

  blDetailsFormGroup: FormGroup;
  @Output() stepIndex: EventEmitter<number> = new EventEmitter<number>();
  billOfLading: BillOfLading;
  preCarrieageList: SelectItem[] = [{label: 'Truck', value: 'TRUCK'}, {label: 'Rail', value: 'RAIL'}, {label: 'Burge', value: 'BURGE'}];
  fieldList = ['shipper', 'consignee', 'portOfLoad', 'portOfDischarge', 'notify', 'blNo',
                'cargoDescription', 'coloadedWith', 'ftzNo', 'mblNo', 'precarriageBy'];

  disableScreen = false;
  constructor(private router: Router, private msgSvc: MessageService, private bookingSvc: BookingService, private billOfLadingSvc: BillOfLadingService) { }

  ngOnInit() {
    this.populateBillOfLadingFormGroup();
    if(isNullOrUndefined(this.bookingSvc.getBookingDetails().billOfLadingId)){
      this.billOfLading = new BillOfLading();
      this.copyBookingToHBL();
      this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
    }else{
      this.disableScreen = true;
      this.billOfLadingSvc.getBillOfLading
                      (this.bookingSvc.getBookingDetails().billOfLadingId).subscribe(
                        (response) => {
                          this.billOfLading = response.json();
                          console.log('Returned bill of lading :' + response.json());
                          this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
                          this.disableScreen = false;
                        },
                        (error) => {
                          this.disableScreen = false;
                        }
                      );
    }
}
  populateBillOfLadingFormGroup(){
    this.blDetailsFormGroup = new FormGroup({
      'shipper': new FormControl(null),
      'consignee': new FormControl(null),
      'portOfLoad': new FormControl(null),
      'portOfDischarge': new FormControl(null),
      'notify': new FormControl(null),
      'blNo': new FormControl(null),

      'cargoDescription': new FormControl(null),
      'coloadedWith': new FormControl(null),
      'ftzNo': new FormControl(null),
      'mblNo': new FormControl(null),
      'precarriageBy': new FormControl(null) // Truck/Rail/Burge
    });
  };

  populateFormGroup(form: FormGroup, billofLading: BillOfLading) {
    for ( const field of this.fieldList ) {
     if (!isNullOrUndefined(billofLading[field])) {
             form.get(field).setValue(billofLading[field]);
           
        } else {
          // form.get(field).setValue(null);
          console.log('Field is undefined or null :' + field + ' : value: ' + form.get(field));
       }
     }
    }
 
  exit() {
    this.msgSvc.clear();
    this.router.navigate(['/booking-list']);
  }
  back() {
    this.stepIndex.emit(1);
  }

  updateBL() {
    this.billOfLading.shipper = this.blDetailsFormGroup.get('shipper').value;
    this.billOfLading.consignee = this.blDetailsFormGroup.get('consignee').value;
    this.billOfLading.portOfLoad = this.blDetailsFormGroup.get('portOfLoad').value;
    this.billOfLading.portOfDischarge = this.blDetailsFormGroup.get('portOfDischarge').value;
    this.billOfLading.notify = this.blDetailsFormGroup.get('notify').value;
    this.billOfLading.blNo = this.blDetailsFormGroup.get('blNo').value;
    this.billOfLading.cargoDescription = this.blDetailsFormGroup.get('cargoDescription').value;
    this.billOfLading.coloadedWith = this.blDetailsFormGroup.get('coloadedWith').value;
    this.billOfLading.ftzNo = this.blDetailsFormGroup.get('ftzNo').value;
    this.billOfLading.mblNo = this.blDetailsFormGroup.get('mblNo').value;
    this.billOfLading.precarriageBy = this.blDetailsFormGroup.get('precarriageBy').value;
    this.billOfLading.bookingDetail =   this.bookingSvc.getBookingDetails() ;
    
    const billOfLadingString = this.bookingSvc.removeTimeZoneFromBillOfLading(this.billOfLading);
    if(isNullOrUndefined(this.billOfLading.id)){
      this.billOfLading = this.billOfLadingSvc.
      saveBillOfLading(billOfLadingString).subscribe(
        (response) => {
          this.billOfLading = response.json();
          this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
          
          console.log(response.json());
          // this.billOfLading.bookingDetail =this.bookingSvc.getBookingDetails();
           // this.print(this.bookingSvc.removeTimeZoneFromObject(this.billOfLading));
        }
      );
    }else{
      this.billOfLading = this.billOfLadingSvc.
      updateBillOfLading(billOfLadingString).subscribe(
        (response) => {
          this.billOfLading = response.json();
          // this.billOfLading.bookingDetail =this.bookingSvc.getBookingDetails();
          console.log(response.json());
           // this.print(this.bookingSvc.removeTimeZoneFromObject(this.billOfLading));
           this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
        }
      );
    }
    
  }
  
  printBL(billOfLading: string){
    this.disableScreen = true;
    this.billOfLadingSvc.getBillOfLadingPdf(this.bookingSvc.getBookingId()).subscribe(
        (response: any) => {
            const fileBlob = response.blob();
            const blob = new Blob([fileBlob], {
                type: 'application/pdf' // must match the Accept type
            });
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL);
            this.disableScreen = false;
        },
        error => {console.log(error);
            this.disableScreen = false;
            // this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
            
        }
    );
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
  copyBookingToHBL() {
    const booking = this.bookingSvc.getBookingDetails();
    // this.billOfLading = new BillOfLading();
    this.billOfLading.carrierRefNo = booking.carrierBookingNo;
    this.billOfLading.cosolidationNo = booking.forwarderRefNo;
    this.billOfLading.shipper = this.getCustomerString(booking.shipper);
    this.billOfLading.consignee = this.getCustomerString(booking.consignee);
    this.billOfLading.delieveryAgent = this.getCustomerString(booking.deliveryAgent);
    this.billOfLading.forwardingAgent = this.getCustomerString(booking.bookingAgent);
    this.billOfLading.notify = this.getCustomerString(booking.notify1);
    this.billOfLading.ingateAtTerminal = this.getPlaceString(booking.ingateAtTerminal);
    this.billOfLading.placeOfDelivery = this.getPlaceString(booking.placeOfDelivery);
    this.billOfLading.placeOfReceipt = this.getPlaceString(booking.placeOfReceipt);
    this.billOfLading.portOfDischarge = this.getPlaceString(booking.portOfDischarge);
    this.billOfLading.portOfLoad = this.getPlaceString(booking.portOfLoad);

    this.billOfLading.shipperRef = booking.shipperRefNo;
    if(isNullOrUndefined(booking.vessel)){
      this.billOfLading.vesselVoyage = null;
    }else{
      this.billOfLading.vesselVoyage = booking.vessel.name;
    }
 }
}
