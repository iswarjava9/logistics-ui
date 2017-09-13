import { BookingService } from './../booking/service/booking.service';
import { BookingDetailService } from './../service/booking-detail.service';
import { Commodity } from './../../../models/commodity.model';
import { isNullOrUndefined } from 'util';
import { ContainerService } from './service/container.service';
import { ContainerType } from './../../../models/containerType.model';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ShortInfo} from '../../../models/metamodel/shortInfo.model';
import {ContainerTypeShortInfo} from '../../../models/metamodel/containerTypeShortInfo.model';
import {Booking} from '../../../models/booking.model';
import {SelectItem} from 'primeng/components/common/selectitem';
import {Container} from '../../../models/container.model';
import {Dialog} from 'primeng/components/dialog/dialog';

import {Event} from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  containers: Container[] = [];
  containerFormGroup: FormGroup;
  containerTypeFormGroup: FormGroup;
  commodityFormGroup: FormGroup;
  bookingDetails: Booking;
  containerType: ContainerType ;
  commodity: Commodity = null;
  filteredContainerTypes: any[];
  filteredCommodities: any[];
  allContainerTypes: any[];
  containerTypeMap: Map<string, number> = new Map();

  numberOfContainers = 1;
  displayOnly = false;

  equipment: SelectItem;
  equipments: SelectItem[];
  constructor(private containerSvc: ContainerService, private bookingSvc: BookingService) { }

  ngOnInit() {
    this.containerFormGroup = new FormGroup(
      {'containerNo': new FormControl(null),
      'containerType': new FormControl(null),
      'seal1': new FormControl(null),
      'seal2': new FormControl(null),
      'seal3': new FormControl(null),
      'tare_lbs': new FormControl(null),
      'tare_kgs': new FormControl(null),
      'gross_lbs': new FormControl(null),
      'gross_kgs': new FormControl(null),
      'equipment': new FormControl(null)
  }
    );

    this.containerTypeFormGroup = new FormGroup({
      'size': new FormControl(null),
      'type': new FormControl(null),
      'containerType': new FormControl(null),
      'teu': new FormControl(null),
      'cbm': new FormControl(null),
      'description': new FormControl(null)
    });

    this.commodityFormGroup = new FormGroup({
      'name': new FormControl(null),
      'description': new FormControl(null),
      'primaryQuantity': new FormControl(null),
      'scheduleB': new FormControl(null),
      'secondaryQuantity': new FormControl(null),
    });
   
    this.bookingDetails = this.bookingSvc.getBookingDetails();;
    if(isNullOrUndefined(this.bookingDetails.containerDetails)){
      this.bookingDetails.containerDetails = [];
    }
     
   /*  this.containers = [{id: null, containerNo: '0001',
      equipment: 'equp1',
      grossKgs: 20,
      grossLbs: 10,
      seal1: 'seal1',
      seal2: 'seal2',
      seal3: 'seal3',
      tareKgs: 30,
      tareLbs: 15,
      vehicleNo: 2561,
      stuffingNo: 7654,
      railwayBillNo: 76543,
      pickupLocalDateTime: null,
      plannedShipLocalDateTime: null,
      cusPickupLastFreeLocalDateTime: null,
      cusReturnLastFreeLocalDateTime: null,
      carrierPickupLastFreeLocalDateTime: null,
      carrierReturnLastFreeLocalDateTime: null,
      dischargeLocalDateTime: null,
      cargos: [],
      bookingId: 0,
      containerType: {id: 0, cbm: 100, teu: 75, containerType: '20X20', descirption: '20X20',
        isoCode: 'iso code', size: '20-20', type: '20X20'},
      quotationId: 0}];
      */
  } 

  onContainerTypeSelection(event: ContainerType) {
    // this.bookingDetails.containerDetails = event;
    console.log(event);
  }
  search(event, key) {
    const query = event.query;
    if (key === 'containerType') {
      this.filteredContainerTypes = this.filterContainerTypes(query);
    }else if (key === 'commodity') {
      this.filteredCommodities = this.filterCommodities(query);
    }
  }


  filterContainerTypes(query): any {
    this.containerSvc.getContainerTypeByName(query).
    subscribe(
        (res: any) => {
            this.filteredContainerTypes = res.json();
            console.log('got response from DB :' + res.json());
        });
  }
  filterCommodities(query): any {
    this.containerSvc.getCommoditiesByName(query).
    subscribe(
        (res: any) => {
            this.filteredCommodities = res.json();
          });
   }
  saveAndNext() {}

  onSelectedItem(event) {
    console.log(event);
  }
  addContainers(event: Event) {
    console.log('Add event: ' + this.numberOfContainers);
    console.log('booking id:' + this.bookingSvc.getBookingId());
    for (let i = 0; i < this.numberOfContainers; i++) {
      const container = new Container();
      container.bookingId = this.bookingSvc.getBookingId();
      container.containerType = this.containerType;
      container.commodity = this.commodity;
      if(container.bookingId != null){
          this.containerSvc.addContainer(container).subscribe(
            (response) => {
              const containerid = Number(response.headers.get('containerid'));
              container.id = containerid;
              console.log('Container created with id: ' + containerid);
            }
          );
    }
      if(isNullOrUndefined(this.bookingDetails.containerDetails)){
        this.bookingDetails.containerDetails = [];
      }
      this.bookingDetails.containerDetails.push(container);
      console.log('Container added.. size = ' + this.containers.length);
      console.log('booking id:' + this.bookingSvc.getBookingId());

    }
    this.updateContainerTypeMap();
  }
  updateContainerTypeMap() {
      this.containerTypeMap.clear();
      for (let i = 0; i < this.containers.length; i++) {
          if (this.containerTypeMap.has(this.containers[i].containerType.type)) {
              this.containerTypeMap.set(this.containers[i].containerType.type, 1);
          }else {
              this.containerTypeMap.set(this.containers[i].containerType.type,
                  this.containerTypeMap.get((this.containers[i].containerType.type) + 1));
          }
      }
      console.log(this.containerTypeMap.entries());
  }

    displayDialog(event: Event, dialog: Dialog) {
      dialog.visible = true;
      
    }
  
  createContainer(event: Event, dialogContainer: Dialog) {
    dialogContainer.visible = true;
  }

  closeDialog(dialog: Dialog){
   dialog.visible = false;
}

createContainerType(dialog: Dialog) {
  this.containerType = new ContainerType();
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('cbm'))){
    this.containerType.cbm = this.containerTypeFormGroup.get('cbm').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('size'))){
    this.containerType.size = this.containerTypeFormGroup.get('size').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('teu'))){
    this.containerType.teu = this.containerTypeFormGroup.get('teu').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('type'))){
    this.containerType.type = this.containerTypeFormGroup.get('type').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('containerType'))){
    this.containerType.containerType = this.containerTypeFormGroup.get('containerType').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('description'))){
    this.containerType.descirption = this.containerTypeFormGroup.get('description').value;
  }
   this.containerSvc.addContainerType(this.containerType).subscribe(
      (response) => {
        this.containerType.id = Number(response.headers.get('containertypeid'));
        dialog.visible = false;}
  
); 
}
createCommodity(dialog: Dialog){
  this.displayOnly = true;
  this.commodity = new Commodity();
    if( !isNullOrUndefined(this.commodityFormGroup.get('name'))) {
      this.commodity.name = this.commodityFormGroup.get('name').value;
    }
    if(!isNullOrUndefined(this.commodityFormGroup.get('description'))){
      this.commodity.description = this.commodityFormGroup.get('description').value;
    }
    if(!isNullOrUndefined(this.commodityFormGroup.get('primaryQuantity'))){
      this.commodity.primaryQuantity = this.commodityFormGroup.get('primaryQuantity').value;
    }
    if(!isNullOrUndefined(this.commodityFormGroup.get('scheduleB'))){
      this.commodity.scheduleB = this.commodityFormGroup.get('scheduleB').value;
    }
    if(!isNullOrUndefined(this.commodityFormGroup.get('secondaryQuantity'))){
      this.commodity.secondaryQuantity = this.commodityFormGroup.get('secondaryQuantity').value;
    }
    
    this.containerSvc.addCommodity(this.commodity).subscribe(
        (response) => {
          this.commodity.id = Number(response.headers.get('commodityid'));
          dialog.visible = false;}
    ); 
  }
}
