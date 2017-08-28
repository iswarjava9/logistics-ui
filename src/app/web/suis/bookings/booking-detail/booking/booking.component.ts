import {Component, Injectable, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
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
import {BookingService} from './service/booking.service';
import {and, forEach} from '@angular/router/src/utils/collection';
import {DateHelper} from '../../../util/dateHelper';
import {Observable} from 'rxjs/Observable';
import {Message} from 'primeng/components/common/message';
import {SelectItem} from 'primeng/components/common/selectitem';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OverlayPanel} from 'primeng/components/overlaypanel/overlaypanel';
import {Country} from '../../../models/country.model';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  @Output() stepIndex: number;

  @Input() bookingId: number;

  msgsGrowl: Message[] = [];
  disableSave = false;

   statusList: SelectItem[];

  fieldsSet: string[] = ['forwarderRefNo', 'shipperRefNo',
                  'aesAuthNo', 'bookingStatus', 'carrierBookingNo',
                  'carrierContact', 'carrierVoyage', 'controller',
                  'freight', 'nraNumber', 'serviceContractId',
                  'typeOfService', 'account', 'consignee',
                  'foreignAgent', 'localSSLineOffice',
                  'notify', 'shipper', 'carrier',
                  'forwarder', 'lineOfBusiness', 'salesRepresentative',
                  'typeOfMove', 'vessel', 'bookingPerson',
                  'division', 'docsCutOffDateTime',
                  'docsReceivedDate', 'eta',
                  'bookingDate', 'cargoMovingDate',
                  'cutOffDate', 'delieveryEta',
                  'rateCutOffDateTime', 'sailDate',
                  'loadTerminal', 'placeOfDelivery',
                  'placeOfReceipt', 'portOfDischarge',
                  'portOfLoad', 'transhipmentPort', 'remarks'];
  dateFieldsSet: string[] = ['docsCutOffDateTime', 'docsReceivedDate', 'eta', 'bookingDate', 'cargoMovingDate',
                            'cutOffDate', 'delieveryEta', 'rateCutOffDateTime', 'sailDate'];
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

  filteredVessels: Vessel[] = [];
  allVessels: Vessel[] = [];

  filteredPersons: Person[] = [];
  allPersons: Person[] = [];

  bookingDetailFormGroup: FormGroup;
  bookingDetails: Booking;
  constructor(private bookingDetailSvc: BookingService, private route: ActivatedRoute, private router: Router) {
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
    booking.docsCutOffDateTime = new Date();
    booking.docsReceivedDate = new Date();
    booking.eta = new Date();
    booking.bookingDate = null;
    booking.cargoMovingDate = new Date();
    booking.cutOffDate = new Date();
    booking.delieveryEta = new Date();
    booking.rateCutOffDateTime = new Date();
    booking.sailDate = new Date();

  // Parties

  booking.foreignAgent = new Customer();
  booking.account = new Customer();
  booking.consignee = new Customer();
  booking.localSSLineOffice = new Customer();
  booking.notify = new Customer();
  booking.shipper = new Customer();
  booking.carrier = new Customer();

  booking.forwarder = new Customer();
  booking.lineOfBusiness = new BusinessLine();
  booking.salesRepresentative = new Person();
  booking.typeOfMove =  new MovementType();
  booking.vessel = new Vessel();
  booking.bookingPerson = new Person();
  booking.division = new Division();

  // Places
  booking.loadTerminal = new Place();
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
      this.bookingDetailSvc.getBooking(this.bookingId).
      subscribe(
        (res: any) => {
          const body = res.json();
          console.log('in getBooking: ' + body);
          DateHelper.convertDateStringsToDates(body);
          this.bookingDetails = body;

          this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
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

        'account': new FormControl(this.bookingDetails.account, Validators.required),
        'consignee': new FormControl(this.bookingDetails.consignee, Validators.required),
        'foreignAgent': new FormControl(this.bookingDetails.foreignAgent),
        'localSSLineOffice': new FormControl(this.bookingDetails.localSSLineOffice),
        'notify': new FormControl(this.bookingDetails.notify),
        'shipper': new FormControl({value: this.bookingDetails.shipper, disabled: true}),
        'carrier': new FormControl(this.bookingDetails.carrier),
        'forwarder': new FormControl(this.bookingDetails.forwarder),
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
        'cargoMovingDate': new FormControl(this.bookingDetails.cargoMovingDate),
        'cutOffDate': new FormControl(this.bookingDetails.cutOffDate),
        'delieveryEta': new FormControl(this.bookingDetails.delieveryEta),
        'rateCutOffDateTime': new FormControl(this.bookingDetails.rateCutOffDateTime),
        'sailDate': new FormControl(this.bookingDetails.sailDate),

        'loadTerminal': new FormControl(this.bookingDetails.loadTerminal),
        'placeOfDelivery': new FormControl(this.bookingDetails.placeOfDelivery),
        'placeOfReceipt': new FormControl(this.bookingDetails.placeOfReceipt),
        'portOfDischarge': new FormControl(this.bookingDetails.portOfDischarge),
        'portOfLoad': new FormControl(this.bookingDetails.portOfLoad),
        'transhipmentPort': new FormControl(this.bookingDetails.transhipmentPort),
        'remarks': new FormControl(this.bookingDetails.remarks)
      }
    );
//    this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
    this.statusList = [{label: 'Select Status', value: 'null'},
      {label: 'Pending', value: 'PENDING'},
      {label: 'Created', value: 'CREATED'},
      {label: 'Hold', value: 'HOLD'},
      { label: 'Approved', value: 'APPROVED'},
      {label: 'Cancelled', value: 'CANCELLED'}];
    this.createdVessel.country = new Country();
  }

  onAccountSelection(event: Customer) {
    this.bookingDetails.account = event;
    console.log(event);
  }

  onClientSelection(event: Client) {
    this.bookingDetails.client = event;
    console.log(event);
  }

  search(event, key, branchkey) {
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
    }

  }

  filterCustomers(query) {
    this.filteredCustomers = [];
      for (let i = 0; i < this.allCustomers.length; i++) {
      const customer = this.allCustomers[i];
      if ( customer.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredCustomers.push(customer);
      }
    }
  }


  filterPlaces(query)/*: Place[]*/ {
    this.filteredPlaces = [];
    // const filtered: any[] = [];
    for (let i = 0; i < this.allPlaces.length; i++) {
      const place = this.allPlaces[i];
      if ( place.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredPlaces.push(place);
      }
    }
    /*return filtered;*/
  }

  filterPersons(query) {
    this.filteredPersons = [];
    /*const filtered: any[] = [];*/
    for (let i = 0; i < this.allPersons.length; i++) {
      const person = this.allPersons[i];
      if ( person.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredPersons.push(person);
      }
    }
    /*return filtered;*/
  }
  filterDivisions(query) {
    this.filteredDivisions = [];
    for (let i = 0; i < this.allDivisions.length; i++) {
      const division = this.allDivisions[i];
      if ( division.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredDivisions.push(division);
      }
    }

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

  onPlaceSelection(event: Place, place: string) {
    console.log(event);

}
  onCustomerSelection(event: Customer, customer: string) {
    console.log(event);
  }

  onLOBSelection(event: BusinessLine, lob: string) {
    console.log(event);
  }

  onDivisionSelection(event: Division, division: string) {
    console.log(event);
  }

  onMovementTypeSelection(event: MovementType, movementType: string) {
    console.log(event);
  }

  onVesselSelection(event: Vessel, vessel: string) {
    console.log(event);
  }


  onPersonSelection(event: Person, person: string) {
    console.log(event);
  }

  saveAndNext() {
    console.log('Form Group-forwarder ref no:' + this.bookingDetailFormGroup.get('forwarderRefNo').value.toString());
    console.log('Submitted-Form Group:' + this.bookingDetailFormGroup.controls);
    this.populateBooking(this.bookingDetailFormGroup, this.bookingDetails);
    this.msgsGrowl = [];
    this.msgsGrowl.push({severity: 'info', summary: 'Update', detail: 'Updating Booking..'});
    this.disableSave = true;

    let jsonString = JSON.stringify(this.bookingDetails);
     console.log('json String:' + jsonString);
    jsonString = JSON.parse(jsonString);


    DateHelper.removeTimeAndTimeZone(jsonString);

    this.bookingDetailSvc.saveBooking(jsonString).subscribe(
      (response: any) => {
        const generatedBookingId = response.headers.get('bookingId');
        const body = response.json();
      //  console.log('Retieving Json in Save before conversion stringified: ' + JSON.stringify(body));
        DateHelper.convertDateStringsToDates(body);
    //    console.log('Retieving Json in Save before conversion converted: ' + JSON.stringify(body));
        this.bookingDetails = body;

         this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
        /*this.bookingDetailSvc.getBooking(this.bookingDetails.id).
        subscribe(
          (res: any) => {
            const body = res.json();
            DateHelper.convertDateStringsToDates(body);
            this.bookingDetails = body;

            this.populateFormGroup(this.bookingDetailFormGroup, this.bookingDetails);
          });
*/

        console.log(response.headers.has('bookingId') + 'Booking is created with id:' + response.headers.get('bookingId'));
        this.msgsGrowl.push(
          {severity: 'info', summary: 'Booking saved', detail: 'Booking is saved with id:' + generatedBookingId});
        this.disableSave = false;
      },
      error => {console.log(error);
        this.disableSave = false;
        this.msgsGrowl.push({severity: 'error', summary: 'Booking failed to saved', detail: 'Booking is not saved'});
        },
      success => {
        console.log(success);
        this.disableSave = false;

      }
    );
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
  onFocusLoad(key: string) {
    if (key === 'place') {
      this.bookingDetailSvc.getPlaces().
      subscribe(
        (res: any) => {
          this.allPlaces = res.json();
          console.log(res.json());
        });
    } else if (key === 'customer') {
      console.log('Focused...');
      this.bookingDetailSvc.getCustomers().
      subscribe(
        (res: any) => {
          this.allCustomers = res.json();
          console.log(res.json());
        });
    } else if (key === 'client') {
      this.bookingDetailSvc.getClients().
      subscribe(
        (res: any) => {
          this.allClients = res.json();
        });
    }else if (key === 'person') {
      this.bookingDetailSvc.getPersons().
      subscribe(
        (res: any) => {
          this.allPersons = res.json();
        });
    } else if (key === 'lineOfBusiness') {
      this.bookingDetailSvc.getBusinessLines().
      subscribe(
        (res: any) => {
          this.allLOBs = res.json();
        });
    }else if (key === 'vessel') {
      this.bookingDetailSvc.getVessels().
      subscribe(
        (res: any) => {
          this.allVessels = res.json();
        });
    } else if (key === 'typeOfMove') {
      this.bookingDetailSvc.getMovementTypess().
      subscribe(
        (res: any) => {
          this.allMoveTypes = res.json();
        });
    }else if (key === 'division') {
      this.bookingDetailSvc.getDivisions().
      subscribe(
        (res: any) => {
          this.allDivisions = res.json();
        });
    }

  }

  exit() {
    this.router.navigate(['/booking-list']);
  }


  displayPlace(event: Event, place: Place, placeId: string, overlaypanel: OverlayPanel, label: string) {
    this.hoveredLabel = label;
    this.hoveredPlaceId = placeId;
    if (place != null && place.id != null) {
      this.hoveredPlace = place;
      this.displayOnly = true;
    } else {
      this.hoveredPlace = null;
      this.displayOnly = true;
      this.createdPlace = new Place();
    }
    overlaypanel.toggle(event);
  }

  createPlace(event: Event) {

    this.bookingDetailSvc.savePlace(this.createdPlace).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('place json : ' + body);

        this.bookingDetails[this.hoveredPlaceId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayCustomer(event: Event, customer: Customer, customerId: string, overlaypanel: OverlayPanel, label: string) {
    this.hoveredLabel = label;
    this.hoveredCustomerId = customerId;
    if (customer != null && customer.id != null) {
      this.createdCustomer = customer;
      this.displayOnly = true;

    } else {
      this.hoveredCustomer = null;
      this.displayOnly = false;
      this.createdCustomer = new Customer();
    }
    overlaypanel.toggle(event);
  }

  createCustomer(event: Event) {

    this.bookingDetailSvc.saveCustomer(this.createdCustomer).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('customer json : ' + body);

        this.bookingDetails[this.hoveredCustomerId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayLineOfBusiness(event: Event, businessLine: BusinessLine, businessLineId: string, overlaypanel: OverlayPanel, label: string) {
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
    overlaypanel.toggle(event);
  }

  createLineOfBusiness(event: Event) {

    this.bookingDetailSvc.saveBusinessLine(this.createdBusinessLine).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Business Line json : ' + body);

        this.bookingDetails[this.hoveredBusinessLineId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }


  displayDivision(event: Event, division: Division, divisionId: string, overlaypanel: OverlayPanel, label: string) {
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
    overlaypanel.toggle(event);
  }

  createDivision(event: Event) {

    this.bookingDetailSvc.saveDivision(this.createdDivision).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Division json : ' + body);

        this.bookingDetails[this.hoveredDivisionId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayMovementType(event: Event, movementType: MovementType, movementTypeId: string, overlaypanel: OverlayPanel, label: string) {
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
    overlaypanel.toggle(event);
  }

  createMovementType(event: Event) {

    this.bookingDetailSvc.saveMovementType(this.createdMovementType).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('MovementType json : ' + body);

        this.bookingDetails[this.hoveredMovementTypeId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }

  displayPerson(event: Event, person: Person, personId: string, overlaypanel: OverlayPanel, label: string) {
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
    overlaypanel.toggle(event);
  }

  createPerson(event: Event) {

    this.bookingDetailSvc.savePerson(this.createdPerson).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Person json : ' + body);

        this.bookingDetails[this.hoveredPersonId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
      },
      success => {
        console.log(success);

      }
    );
  }


  displayVessel(event: Event, vessel: Vessel, vesselId: string, overlaypanel: OverlayPanel, label: string) {
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
    overlaypanel.toggle(event);
  }

  createVessel(event: Event) {

    this.bookingDetailSvc.saveVessel(this.createdVessel).subscribe(
      (response: any) => {

        const body = response.json();
        console.log('Vessel json : ' + body);

        this.bookingDetails[this.hoveredVesselId] = body;
      },
      error => {console.log(error);

        this.msgsGrowl.push({severity: 'error', summary: 'Creation failed ', detail: this.hoveredLabel + 'Creation Failed'});
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
}
