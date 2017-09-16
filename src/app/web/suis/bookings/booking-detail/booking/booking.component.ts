import { MessageService } from 'primeng/components/common/messageservice';
import { RootService } from './../../../../../root.service';
import { DateHelper } from './../../../util/dateHelper';
import { TimeZone } from './../../../models/timezone.model';
import { HttpResponse } from '@angular/common/http';
import { Headers, Response } from '@angular/http';
import { City } from './../../../models/city.model';
import { ForeignAgent } from './../../../models/foreignAgent.model';
import {Component, Injectable, Input, OnInit, Output, ViewEncapsulation, EventEmitter} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Booking} from '../../../models/booking.model';
import {Place} from '../../../models/place.model';
import {Client} from '../../../models/client.model';
import {Customer} from '../../../models/customer.model';
import {BusinessLine} from '../../../models/businessLine.model';
import {Division} from '../../../models/division.model';
import {MovementType} from '../../../models/movementType.model';
import {Vessel} from '../../../models/vessel.model';
import {Person} from '../../../models/person.model';
import {State} from '../../../models/state.model';

import {BookingService} from './service/booking.service';
import {and, forEach} from '@angular/router/src/utils/collection';
import {Observable} from 'rxjs/Observable';
import {Message} from 'primeng/components/common/message';
import {SelectItem} from 'primeng/components/common/selectitem';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OverlayPanel} from 'primeng/components/overlaypanel/overlaypanel';
import {Country} from '../../../models/country.model';
import {isNullOrUndefined} from 'util';
import {Dialog} from 'primeng/components/dialog/dialog';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @Output() stepIndex: EventEmitter<number> = new EventEmitter<number>();;

  @Input() bookingId: number;

  msgsGrowl: Message[] = [];
  disableScreen = false;

   statusList: SelectItem[];
   serviceTypeList: SelectItem[];
   timezoneIdList: SelectItem[];
   freightList: SelectItem[];

  fieldsSet: string[] = ['forwarderRefNo', 'shipperRefNo',
                  'aesAuthNo', 'bookingStatus', 'carrierBookingNo',
                  'carrierContact', 'carrierVoyage', 'controller',
                  'freight', 'nraNumber', 'serviceContractId',
                  'typeOfService', 'billTo', 'consignee',
                  'deliveryAgent', 'localSSLineOffice',
                  'notify1', 'notify2', 'cargoSupplier', 'shipper', 'carrier',
                  'bookingAgent', 'lineOfBusiness', 'salesRepresentative',
                  'typeOfMove', 'vessel', 'bookingPerson',
                  'division', 'docsCutOffDateTime',
                  'docsReceivedDate', 'eta',
                  'bookingDate', 'amendmentDate', 'cargoMovingDate',
                  'portCutOffDate', 'delieveryEta',
                  'railCutOffDateTime', 'sailDate', 'emptyPickupDate', 'earlyReceivingDate',
                  'emptyContainerPickup', 'ingateAtTerminal', 'placeOfDelivery',
                  'placeOfReceipt', 'portOfDischarge',
                  'portOfLoad', 'transhipmentPort', 'remarks'];
  dateFieldsSet: string[] = ['docsCutOffDateTime', 'docsReceivedDate', 'eta', 'bookingDate', 'amendmentDate', 'cargoMovingDate',
                            'portCutOffDate', 'delieveryEta', 'railCutOffDateTime', 'sailDate',  'emptyPickupDate', 'earlyReceivingDate'];
  //Cities
  filteredCities: any[] = [];

  // client
  client: Client;
  filteredClients: any[] = [];
  allClients: any[] = [];

  // places
  allPlaces: any[] = [];
  filteredPlaces: any[] = [];

  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  filteredLOBs: BusinessLine[] = [];
  allLOBs: BusinessLine[] = [];

  filteredDivisions: Division[] = [];
  allDivisions: Division[] = [];

  filteredMoveTypes: MovementType[] = [];
  allMoveTypes: MovementType[] = [];

  filteredVessels: any[] = [];
  allVessels: any[] = [];

  filteredPersons: Person[] = [];
  allPersons: Person[] = [];

  bookingDetailFormGroup: FormGroup;
  customerFormGroup: FormGroup;
  placeFormGroup: FormGroup;
  bookingDetails: Booking;
  constructor(private bookingDetailSvc: BookingService, private route: ActivatedRoute, private router: Router, private rootSvc: RootService, private msgSvc: MessageService) {
  }
  public shipperRefNo: string;
  public forwarderRefNo: string;
  public aesAuthNo: number;
  public bookingStatus: string;
  public carrierBookingNo: number;
  public carrierContact: string;
  public carrierVoyage: string;
  public controller: string;
  public freight: string;
  public nraNumber: string;
  public serviceContractId: number;
  public typeOfService: string;

  hoveredLabel: string;
  displayOnly = false;
  // For overlay panels -Place
  hoveredPlace: Place;
  hoveredPlaceId: string;
  createdPlace: Place = new Place();

  // For overlay panels - Customer
  hoveredCustomer: Customer;
  hoveredCustomerId: string;
  createdCustomer: Customer = new Customer();
  

  // For overlay panels - Line Of Business
  hoveredBusinessLine: BusinessLine;
  hoveredBusinessLineId: string;
  createdBusinessLine: BusinessLine = new BusinessLine();
  //  showDialog = false;

  // For overlay panels - Division
  hoveredDivision: Division;
  hoveredDivisionId: string;
  createdDivision: Division = new Division();

  // For overlay panels - MovementType
  hoveredMovementType: MovementType;
  hoveredMovementTypeId: string;
  createdMovementType: MovementType = new MovementType();

  // For overlay panels - Person
  hoveredPerson: Person;
  hoveredPersonId: string;
  createdPerson: Person = new Person();

  // For overlay panels - Vessel
  hoveredVessel: Vessel;
  hoveredVesselId: string;
  createdVessel: Vessel = new Vessel();

  initializeBooking(): Booking {
    let booking: Booking;
    booking = new Booking();
    booking.docsCutOffDateTime = null;
    booking.docsReceivedDate = null;
    booking.eta = null;
    booking.bookingDate = null;
    booking.amendmentDate = null;
    booking.cargoMovingDate = null;
    booking.portCutOffDate = null;
    booking.delieveryEta = null;
    booking.railCutOffDateTime = null;
    booking.sailDate = null;
    booking.emptyPickupDate = null;
    booking.earlyReceivingDate = null;

  // Parties

  booking.deliveryAgent = new Customer();
  booking.billTo = new Customer();
  booking.consignee = new Customer();
  booking.localSSLineOffice = new Customer();
  booking.notify1 = new Customer();
  booking.notify2 = new Customer();
  booking.cargoSupplier = new Customer();
  booking.shipper = new Customer();
  booking.carrier = new Customer();

  booking.bookingAgent = new Customer();
  booking.lineOfBusiness = new BusinessLine();
  booking.salesRepresentative = new Person();
  booking.typeOfMove =  new MovementType();
  booking.vessel = new Vessel();
  booking.bookingPerson = new Person();
  booking.division = new Division();

  // Places
  booking.emptyContainerPickup = new Place();
  booking.ingateAtTerminal = new Place();
  booking.placeOfDelivery = new Place();
  booking.placeOfReceipt = new Place();
  booking.portOfDischarge = new Place();
  booking.portOfLoad = new Place();
  booking.transhipmentPort = new Place();
  return booking;
}

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.bookingId = params['id'];
      }
    );
    this.bookingDetails = this.initializeBooking();
    if ( this.bookingId != null ) {
      this.disableScreen = true;
      this.bookingDetailSvc.getBooking(this.bookingId).
      subscribe(
        (res: any) => {
          const body = res.json();
          console.log('in getBooking: ' + body);
          DateHelper.convertDateStringsToDates(body);
          this.bookingDetails = body;

          this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
          this.bookingDetailSvc.updateBooking(this.bookingDetails);
          this.disableScreen = false;
        });
      }



    this.bookingDetailFormGroup = new FormGroup(
      {
        'forwarderRefNo': new FormControl(this.bookingDetails.forwarderRefNo),
        'shipperRefNo': new FormControl(this.bookingDetails.shipperRefNo),
        /*'nvoccBookingNo': new FormControl(this.bookingDetails.nvoccBookingNo),*/
        'aesAuthNo': new FormControl(this.bookingDetails.aesAuthNo),
        'bookingStatus': new FormControl(this.bookingDetails.bookingStatus),
        'carrierBookingNo': new FormControl(this.bookingDetails.carrierBookingNo),
        /*'carrierContact': new FormControl(this.bookingDetails.carrierContact),*/
        'carrierVoyage': new FormControl(this.bookingDetails.carrierVoyage),
        'controller': new FormControl(this.bookingDetails.controller),
        'freight': new FormControl(this.bookingDetails.freight),
        'nraNumber': new FormControl(this.bookingDetails.nraNumber),
        'serviceContractId': new FormControl(this.bookingDetails.serviceContractId),
        'typeOfService': new FormControl(this.bookingDetails.typeOfService),

        'billTo': new FormControl(this.bookingDetails.billTo, Validators.required),
        'consignee': new FormControl(this.bookingDetails.consignee, Validators.required),
        'deliveryAgent': new FormControl(this.bookingDetails.deliveryAgent),
        'localSSLineOffice': new FormControl(this.bookingDetails.localSSLineOffice),
        'notify1': new FormControl(this.bookingDetails.notify1),
        'notify2': new FormControl(this.bookingDetails.notify2),
        'cargoSupplier': new FormControl(this.bookingDetails.cargoSupplier),
        'shipper': new FormControl(this.bookingDetails.shipper, Validators.required),
        'carrier': new FormControl(this.bookingDetails.carrier),
        'bookingAgent': new FormControl(this.bookingDetails.bookingAgent, Validators.required),
        'lineOfBusiness': new FormControl(this.bookingDetails.lineOfBusiness),
        'salesRepresentative': new FormControl(this.bookingDetails.salesRepresentative),
        'typeOfMove': new FormControl(this.bookingDetails.typeOfMove),
        'vessel': new FormControl(this.bookingDetails.vessel),
        'bookingPerson': new FormControl(this.bookingDetails.bookingPerson),
        'division': new FormControl(this.bookingDetails.division),

        'docsCutOffDateTime': new FormControl(this.bookingDetails.docsCutOffDateTime),
        'docsReceivedDate': new FormControl(this.bookingDetails.docsReceivedDate),
        'eta': new FormControl(this.bookingDetails.eta),
        'bookingDate': new FormControl({value: this.bookingDetails.bookingDate, disabled: true}),
        'amendmentDate': new FormControl({value: this.bookingDetails.amendmentDate, disabled: true}),
        'cargoMovingDate': new FormControl(this.bookingDetails.cargoMovingDate),
        'portCutOffDate': new FormControl(this.bookingDetails.portCutOffDate),
        'delieveryEta': new FormControl(this.bookingDetails.delieveryEta),
        'railCutOffDateTime': new FormControl(this.bookingDetails.railCutOffDateTime),
        'sailDate': new FormControl(this.bookingDetails.sailDate),
        'emptyPickupDate': new FormControl(this.bookingDetails.emptyPickupDate),
        'earlyReceivingDate': new FormControl(this.bookingDetails.earlyReceivingDate),

        'emptyContainerPickup': new FormControl(this.bookingDetails.emptyContainerPickup),
        'ingateAtTerminal': new FormControl(this.bookingDetails.ingateAtTerminal),
        'placeOfDelivery': new FormControl(this.bookingDetails.placeOfDelivery),
        'placeOfReceipt': new FormControl(this.bookingDetails.placeOfReceipt),
        'portOfDischarge': new FormControl(this.bookingDetails.portOfDischarge),
        'portOfLoad': new FormControl(this.bookingDetails.portOfLoad),
        'transhipmentPort': new FormControl(this.bookingDetails.transhipmentPort),
        'remarks': new FormControl(this.bookingDetails.remarks)
      }
    );
    this.customerFormGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'taxId': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'personInCharge': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'phone': new FormControl(null, Validators.required)
    }
    );
    this.placeFormGroup = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'address': new FormControl(null, Validators.required),
      'city': new FormControl(null, Validators.required),
      'state': new FormControl(null, Validators.required),
      'country': new FormControl(null, Validators.required),
      'code': new FormControl(null),
      'timeZoneId': new FormControl(null, [Validators.required, Validators.required])
    }
    );
//    this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
    this.statusList = [{label: 'Select Status', value: 'null'},
      {label: 'Advanced', value: 'ADVANCED'},
      {label: 'Confirmed', value: 'CONFIRMED'},
      {label: 'Cancelled', value: 'CANCELLED'}];
  
      this.serviceTypeList = [{label: 'Door to Door', value: 'Door to Door'}, 
                              {label: 'Port to Port', value: 'Port to Port'},
                              {label: 'Door to Port', value: 'Door to Port'},
                              {label: 'Port to Door', value: 'Port to Door'}];
      this.createdVessel.country = new Country();
      
      this.freightList = [{label: 'Prepaid', value: 'Prepaid'}, {label: 'Collect', value: 'Collect'}];
      this.timezoneIdList = this.rootSvc.getTimeZones();
      // this.initializeTimeZoneIds(); 
      this.bookingDetailSvc.updateBooking(this.bookingDetails);
  }

  onAccountSelection(event: Customer) {
    this.bookingDetails.billTo = event;
    console.log(event);
  }

  onClientSelection(event: Client) {
    this.bookingDetails.client = event;
    console.log(event);
  }

  search(event, key) {
    const query = event.query;
    if (key === 'place') {
       this.filterPlaces(query);
    } else if (key === 'customer') {
      this.filterCustomers(query);
    } else if (key === 'person') {
      this.filterPersons(query);
    } else if (key === 'division') {
        this.filterDivisions(query);
    }else if (key === 'lineOfBusiness') {
        this.filterLOBs(query);
    }else if (key === 'city') {
      this.filterCities(query);
  }else if(key === 'vessel'){
    this.filterVessels(query);
  }

  }

  filterCustomers(query) {
      this.bookingDetailSvc.getCustomers(query).
      subscribe(
          (res: any) => {
              this.filteredCustomers = res.json();
              console.log('got response from DB :' + res.json());
          });

    return this.filteredCustomers;
  }

  filterPlaces(query)/*: Place[]*/ {
      this.bookingDetailSvc.getPlaces(query).
      subscribe(
          (res: any) => {
              this.filteredPlaces = res.json();
              console.log('got response from DB :' + res.json());
          });
    
      return this.filteredPlaces;
    
  }

  filterPersons(query) {
    this.bookingDetailSvc.getPersons(query).
    subscribe(
        (res: any) => {
            this.filteredPersons = res.json();
            console.log('got response from DB :' + res.json());
        });
  
    return this.filteredPersons;
  
  }
  filterDivisions(query) {
    this.bookingDetailSvc.getDivisions(query).
    subscribe(
        (res: any) => {
            this.filteredDivisions = res.json();
        });
    return this.filteredDivisions;
  }

  filterLOBs(query) {
    this.filteredLOBs = [];
    for (let i = 0; i < this.allLOBs.length; i++) {
      const lob = this.allLOBs[i];
      if ( lob.description.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredLOBs.push(lob);
      }
    }
  }

  filterCities(query) {
    this.bookingDetailSvc.getCities(query).
    subscribe(
        (res: any) => {
            this.filteredCities = res.json();
            console.log('got response from DB :' + res.json().toString());
            const cities:City[] = res.json();
            console.log(JSON.stringify(cities));
            console.log('cities:'+ JSON.stringify(cities));
        });
  
    return this.filteredCities;
 }

 filterVessels(query) {
  this.bookingDetailSvc.getVessels(query).
  subscribe(
      (res: any) => {
          this.filteredVessels = res.json();
        });

  return this.filteredCities;
 
}

  onPlaceSelection(event: Place, place: string) {
    this.bookingDetailFormGroup.get(place).setValue(event);
    console.log(event);

}

  saveAndExit(){
    this.saveBooking('/booking-list', -1);
    // this.router.navigate(['/booking-list']);
  }

  next() {
    this.stepIndex.emit(1);
  }
  saveAndNext() {
    
    this.saveBooking(null, 1);
    this.bookingDetailSvc.updateBooking(this.bookingDetails);   
    // this.stepIndex.emit(1);
  }


  saveBooking(route: string, step: number) {
    this.populateBooking(this.bookingDetailFormGroup, this.bookingDetails);
    this.msgsGrowl = [];
   
    this.disableScreen = true;


    if(isNullOrUndefined(this.bookingDetails.id)){
      this.bookingDetails.bookingStatus = 'ADVANCED';
      this.msgSvc.add({severity: 'info', summary: 'Create', detail: 'Creating Booking..'});
      // this.msgsGrowl.push({severity: 'info', summary: 'Create', detail: 'Creating Booking..'});
      this.bookingDetailSvc.saveBooking(this.bookingDetailSvc.removeTimeZoneFromBooking(this.bookingDetails)).subscribe(
        (response: any) => {
         // const generatedBookingId = response.headers.get('bookingid');
          const body = response.json();
          DateHelper.convertDateStringsToDates(body);
          this.bookingDetails = body;
          this.bookingDetailSvc.updateBooking(this.bookingDetails);
          const createBookingMsg = {severity: 'info', summary: 'Booking Created', detail: 'Booking is created'};
          this.msgSvc.add(createBookingMsg);
          //this.msgsGrowl.push(createBookingMsg);
        this.bookingDetailSvc.updateMessages(createBookingMsg);
          if(route != null){
            this.router.navigate([route]);
          }else if(step > -1 ){
            this.stepIndex.emit(step);
          }else{
              this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
          }
          
          this.disableScreen = false;
      },
      error => {console.log(error);
        this.disableScreen = false;
        this.msgSvc.add({severity: 'error', summary: 'Booking failed to saved', detail: 'Booking is not saved'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Booking failed to saved', detail: 'Booking is not saved'});
        },

    );
  }else{ // Modify booking
    /* this.msgsGrowl.push(
      {severity: 'info', summary: 'Modify Booking', detail: 'Modifying Booking...'}); */
      this.msgSvc.add({severity: 'info', summary: 'Modify Booking', detail: 'Modifying Booking...'})
      this.bookingDetailSvc.modifyBooking(this.bookingDetailSvc.removeTimeZoneFromBooking(this.bookingDetails)).subscribe(
      (response: any) => {
        const modifyMsg = {severity: 'info', summary: 'Booking is modified', detail: 'Booking is modified'};
        // this.msgsGrowl.push(modifyMsg);
           this.msgSvc.add(modifyMsg);
           
           const body = response.json();
      
        DateHelper.convertDateStringsToDates(body);
   
        this.bookingDetails = body;
        this.bookingDetailSvc.updateBooking(this.bookingDetails);
        this.bookingDetailSvc.updateMessages(modifyMsg);
        if(route != null){
          this.router.navigate([route]);
        }else if(step > -1 ){
          this.stepIndex.emit(step);
        }else{
          this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
        }
         
           
        this.disableScreen = false;
        // this.bookingDetailSvc.activeIndex = 1;
      },
      error => {console.log(error);
        this.disableScreen = false;
        this.msgSvc.add({severity: 'error', summary: 'Booking failed to saved', detail: 'Booking is not modified'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Booking failed to saved', detail: 'Booking is not modified'});
        },
    );
  }
 }

  populateFormGroup(form: FormGroup, booking: Booking) {
     for ( const field of this.fieldsSet ) {
      if (!isNullOrUndefined(booking[field])) {
        if (!isNullOrUndefined(form.get(field))) {
          form.get(field).setValue(booking[field]);
        } else {
          console.log('Field is undefined or null :' + field + ' : value: ' + form.get(field));
        }
      }
    }
  }

  populateBooking(form: FormGroup, booking: Booking) {
    for ( const field of this.fieldsSet ) {
      if (!isNullOrUndefined(form.get(field))) {
          booking[field] = form.get(field).value;
        } else {
          console.log('Field is undefined or null :' + field + ' : value: ' );
        }
    }
  }
  onFocusLoad(key: string, selection: string) {
    if (key === 'place') {
      /*this.bookingDetailSvc.getPlaces().
      subscribe(
        (res: any) => {
          this.allPlaces = res.json();
          console.log(res.json());
        });*/
    } else if (key === 'customer') {
        /*this.bookingDetails[selection].show*/
      // console.log('Focused...');
      /*this.bookingDetailSvc.getCustomers().
      subscribe(
        (res: any) => {
          this.allCustomers = res.json();
          console.log(res.json());
        });*/
    } else if (key === 'client') {
      this.bookingDetailSvc.getClients().
      subscribe(
        (res: any) => {
          this.allClients = res.json();
        });
    }/* else if (key === 'person') {
      this.bookingDetailSvc.getPersons().
      subscribe(
        (res: any) => {
          this.allPersons = res.json();
        });
    } */ else if (key === 'lineOfBusiness') {
      this.bookingDetailSvc.getBusinessLines().
      subscribe(
        (res: any) => {
          this.allLOBs = res.json();
        });
    }/* else if (key === 'vessel') {
      this.bookingDetailSvc.getVessels().
      subscribe(
        (res: any) => {
          this.allVessels = res.json();
        });
    }  */else if (key === 'typeOfMove') {
      this.bookingDetailSvc.getMovementTypess().
      subscribe(
        (res: any) => {
          this.allMoveTypes = res.json();
        });
    }/* else if (key === 'division') {
      this.bookingDetailSvc.getDivisions().
      subscribe(
        (res: any) => {
          this.allDivisions = res.json();
        });
    } */

  }

  exit() {
    this.msgSvc.clear();
    this.router.navigate(['/booking-list']);
  }


  displayPlace(event: Event, placeId: string, dialog: Dialog, label: string) {
    const place = this.bookingDetailFormGroup.get(placeId).value;
    this.hoveredLabel = label;
    this.hoveredPlaceId = placeId;
    this.hoveredPlaceId = placeId;
    if (place != null && place.id != null) {
     this.createdPlace = place;
     this.populatePlaceFormGroup(place);
     this.displayOnly = true;
    } else {
      this.hoveredPlace = null;
      this.displayOnly = false;
      this.createdPlace = new Place();
      this.populatePlaceFormGroup(this.createdPlace);
    }
      this.showDialog(dialog);
  }

  populatePlaceFormGroup(place: Place){
    this.placeFormGroup.get('name').setValue(place.name);
    this.placeFormGroup.get('code').setValue(place.code);
    this.placeFormGroup.get('address').setValue(place.address);
    
    if(!isNullOrUndefined(place.city)){
      this.placeFormGroup.get('city').setValue(place.city);
      if(!isNullOrUndefined(place.city.state)){
        this.placeFormGroup.get('state').setValue(place.city.state.name);
        if(!isNullOrUndefined(place.city.state)){
          this.placeFormGroup.get('country').setValue(place.city.state.country.name);
        }
      }
    }else{
      this.placeFormGroup.get('city').setValue(null);
      this.placeFormGroup.get('state').setValue(null);
      this.placeFormGroup.get('country').setValue(null);
    }
    
    this.placeFormGroup.get('timeZoneId').setValue(place.timeZoneId);
  }
  populateCustomerFormGroup(customer: Customer){
    this.customerFormGroup.get('name').setValue(customer.name);
    this.customerFormGroup.get('taxId').setValue(customer.taxId);
    this.customerFormGroup.get('address').setValue(customer.address);
    this.customerFormGroup.get('city').setValue(customer.city);
    this.customerFormGroup.get('email').setValue(customer.email);
    this.customerFormGroup.get('phone').setValue(customer.phone);
    this.customerFormGroup.get('personInCharge').setValue(customer.personInCharge);

    if(!isNullOrUndefined(customer.city)){
      this.customerFormGroup.get('city').setValue(customer.city);
      if(!isNullOrUndefined(customer.city.state)){
        this.customerFormGroup.get('state').setValue(customer.city.state.name);
        if(!isNullOrUndefined(customer.city.state)){
          this.customerFormGroup.get('country').setValue(customer.city.state.country.name);
        }
      }
  }else{
    this.customerFormGroup.get('city').setValue(null);
    this.customerFormGroup.get('state').setValue(null);
    this.customerFormGroup.get('country').setValue(null);
  }
  }

  createPlace(dialog: Dialog, event: Event) {

    this.displayOnly = true;
    this.createdPlace.name = this.placeFormGroup.get('name').value;
    this.createdPlace.code = this.placeFormGroup.get('code').value;
    this.createdPlace.address = this.placeFormGroup.get('address').value;
    this.createdPlace.city = this.placeFormGroup.get('city').value;
    this.createdPlace.timeZoneId = this.placeFormGroup.get('timeZoneId').value;
    

    this.bookingDetailSvc.savePlace(this.createdPlace).subscribe(
      (response) => {
        const headers = response.headers;
        this.createdPlace.id = Number(headers.get('placeid'));
        // this.bookingDetails[this.hoveredPlaceId] = response.json();
        this.bookingDetailFormGroup.get(this.hoveredPlaceId).setValue(this.createdPlace);
        this.closePlaceDialog(dialog, event);
        
        this.displayOnly = false;
      },
      error => {console.log(error);
        this.displayOnly = false;
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      }
    );
  }

  displayCustomer(event: Event, customerId: string, dialog: Dialog, label: string) {
    const customer = this.bookingDetailFormGroup.get(customerId).value;
    this.hoveredLabel = label;
    this.hoveredCustomerId = customerId;
    if (customer != null && customer.id != null) {
      this.createdCustomer = customer;
      this.populateCustomerFormGroup(customer);
      this.displayOnly = true;

    } else {
      this.hoveredCustomer = null;
      this.displayOnly = false;
      this.createdCustomer = new Customer();
      this.createdCustomer.city = new City();
      this.createdCustomer.city.state = new State();
      this.createdCustomer.city.state.country = new Country();
      this.populateCustomerFormGroup(this.createdCustomer);
      
    }
     this.showDialog(dialog);
  }

  createCustomer(dialog: Dialog, event: Event) {
    this.displayOnly = true;
    this.createdCustomer.name = this.customerFormGroup.get('name').value;
    this.createdCustomer.address = this.customerFormGroup.get('address').value;
    this.createdCustomer.city = this.customerFormGroup.get('city').value;
    this.createdCustomer.email = this.customerFormGroup.get('email').value;
    this.createdCustomer.phone = this.customerFormGroup.get('phone').value;
    this.createdCustomer.personInCharge = this.customerFormGroup.get('personInCharge').value;
    
    this.bookingDetailSvc.saveCustomer(this.createdCustomer).subscribe(
      (response: Response) => {

        const customerId = response.headers.get('customerId');
        console.log('customer id : ' + customerId);
        this.createdCustomer.id = Number(customerId);
        // this.bookingDetails[this.hoveredCustomerId] = this.createdCustomer;
        this.bookingDetailFormGroup.get(this.hoveredCustomerId).setValue(this.createdCustomer);
       this.closeCustomerDialog(dialog, event);
        this.displayOnly = false;
        this.msgSvc.add({severity: 'success', summary: 'Creation Success ', detail: this.hoveredLabel + 'Creation Success'});
        // this.msgsGrowl.push({severity: 'success', summary: 'Creation Success ', detail: this.hoveredLabel + 'Creation Success'});
      },
      error => {
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        this.displayOnly = true;
      },
      success => {
        console.log(success);

      }
    );
  }

  displayLineOfBusiness(event: Event, businessLineId: string, dialog: Dialog, label: string) {
      const businessLine = this.bookingDetailFormGroup.get(businessLineId).value;
    this.hoveredLabel = label;
    this.hoveredBusinessLineId = businessLineId;
    if (businessLine != null && businessLine.id != null) {
      this.createdBusinessLine = businessLine;
      this.displayOnly = true;

    } else {
      this.hoveredBusinessLine = null;
      this.displayOnly = false;
      this.createdBusinessLine = new BusinessLine();
    }

    this.showDialog(dialog);
  }
    showDialog(dialog: Dialog) {
        dialog.visible = true;
    }

    closeDialog(dialog: Dialog, event: Event) {
      
      dialog.visible = false;
     //  dialog.close(event);
    }
    closePlaceDialog(dialog: Dialog, event: Event) {
      dialog.visible = false;
    //  dialog.close(event);
      this.placeFormGroup.get('name').setValue(null);
      this.placeFormGroup.get('code').setValue(null);
      this.placeFormGroup.get('address').setValue(null);
      this.placeFormGroup.get('city').setValue(null);
      this.placeFormGroup.get('state').setValue(null);
      this.placeFormGroup.get('country').setValue(null);
      this.placeFormGroup.get('timeZoneId').setValue(null);

    }
    closeCustomerDialog(dialog: Dialog, event: Event) {
      dialog.visible = false;
      //dialog.close(event);
      this.customerFormGroup.get('name').setValue(null);
      this.customerFormGroup.get('address').setValue(null);
      this.customerFormGroup.get('city').setValue(null);
      this.customerFormGroup.get('email').setValue(null);
      this.customerFormGroup.get('phone').setValue(null);
    }
  createLineOfBusiness(dialog: Dialog, event: Event) {

    this.bookingDetailSvc.saveBusinessLine(this.createdBusinessLine).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Business Line json : ' + body);

        this.bookingDetails[this.hoveredBusinessLineId] = body;
      },
      error => {console.log(error);
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }


  displayDivision(event: Event, divisionId: string, dialog: Dialog, label: string) {
      const division = this.bookingDetailFormGroup.get(divisionId).value;
    this.hoveredLabel = label;
    this.hoveredDivisionId = divisionId;
    if (division != null && division.id != null) {
      this.createdDivision = division;
      this.displayOnly = true;

    } else {
      // this.hoveredDivision = null;
      this.displayOnly = false;
      this.createdDivision = new Division();
    }
    dialog.visible = true;
  }

  createDivision(dialog: Dialog, event: Event) {

    this.bookingDetailSvc.saveDivision(this.createdDivision).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Division json : ' + body);

        this.bookingDetails[this.hoveredDivisionId] = body;
      },
      error => {console.log(error);
          this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      //  this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayMovementType(event: Event, movementTypeId: string, dialog: Dialog, label: string) {
    const movementType = this.bookingDetailFormGroup.get(movementTypeId).value;
    this.hoveredLabel = label;
    this.hoveredMovementTypeId = movementTypeId;
    if (movementType != null && movementType.id != null) {
      this.createdMovementType = movementType;
      this.displayOnly = true;
    } else {
      this.hoveredMovementType = null;
      this.displayOnly = false;
      this.createdMovementType = new MovementType();
    }
    dialog.visible = true;
  }

  createMovementType(dialog: Dialog, event: Event) {

    this.bookingDetailSvc.saveMovementType(this.createdMovementType).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('MovementType json : ' + body);

        this.bookingDetails[this.hoveredMovementTypeId] = body;
      },
      error => {console.log(error);
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayPerson(event: Event, personId: string, dialog: Dialog, label: string) {
    const person = this.bookingDetailFormGroup.get(personId).value;
    this.hoveredLabel = label;
    this.hoveredPersonId = personId;
    if (person != null && person.id != null) {
      this.createdPerson = person;
      this.displayOnly = true;

    } else {
      this.hoveredPerson = null;
      this.displayOnly = false;
      this.createdPerson = new Person();
      
    }
    dialog.visible = true;
  }

  createPerson(dialog: Dialog, event: Event) {
    this.displayOnly = true;
    this.bookingDetailSvc.savePerson(this.createdPerson).subscribe(
      (response: any) => {

        const personid = Number(response.headers.get('personid'));
        this.createdPerson.id = personid;
        this.bookingDetailFormGroup.get(this.hoveredPersonId).setValue(this.createdPerson);
        this.msgSvc.add({severity: 'success', summary: 'Creation succeeded ', detail: this.hoveredLabel + ' Created.'});
        this.displayOnly = false;
        dialog.visible = false;
      },
      error => {console.log(error);
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        this.displayOnly = true;
      },
      success => {
        console.log(success);

      }
    );
  }


  displayVessel(event: Event, vesselId: string, dialog: Dialog, label: string) {
    const vessel = this.bookingDetailFormGroup.get(vesselId).value;
    this.hoveredLabel = label;
    this.hoveredVesselId = vesselId;
    if (vessel != null && vessel.id != null) {
      this.createdVessel = vessel;
      if ( this.createdVessel.country == null) {
        this.createdVessel.country = new Country();
      }
      this.displayOnly = true;

    } else {
      this.hoveredVessel = null;
      this.displayOnly = false;
      this.createdVessel = new Vessel();
      this.createdVessel.country = new Country();
    }
    dialog.visible = true;
  }

  createVessel(dialog: Dialog, event: Event) {
    this.displayOnly = true;
    this.bookingDetailSvc.saveVessel(this.createdVessel).subscribe(
      (response: any) => {

        const vesselid = Number(response.headers.get('vesselid'));
        this.createdVessel.id = vesselid;
        this.bookingDetailFormGroup.get(this.hoveredVesselId).setValue(this.createdVessel);
       // this.bookingDetails[this.hoveredVesselId] = this.createdVessel;
        this.closeDialog(dialog, event);
        this.displayOnly = false;
        this.msgSvc.add({severity: 'success', summary: 'Creation Success ', detail: this.hoveredLabel + 'Creation Succeeded'});
        // this.msgsGrowl.push({severity: 'success', summary: 'Creation Success ', detail: this.hoveredLabel + 'Creation Succeeded'});
      },
      error => {console.log(error);
        this.displayOnly = false;
        this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
        // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  onSubmit() {
    console.log('Submit is called....');

    console.log(this.bookingDetailFormGroup);
  }

  print() {
      this.disableScreen = true;
      this.bookingDetailSvc.getPDF(this.bookingDetails.id).subscribe(
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
              this.msgSvc.add({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
              // this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
          },
          success => {
              console.log(success);
              this.disableScreen = false;
          }
      );
  }
  onCitySelection(formGroup: FormGroup){
    const city = formGroup.get('city').value;
    formGroup.get('state').setValue(city.state.name);
    formGroup.get('country').setValue(city.state.country.name);
  }
  
  

  clearPlace(formGroup: FormGroup, fieldControl: string){
   formGroup.get(fieldControl).setValue(null);
    this.createdPlace = null;
  }
}
