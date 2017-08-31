import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ShortInfo} from '../../../models/metamodel/shortInfo.model';
import {ContainerTypeShortInfo} from '../../../models/metamodel/containerTypeShortInfo.model';
import {Booking} from '../../../models/booking.model';
import {SelectItem} from 'primeng/components/common/selectitem';
import {ContainerType} from '../../../models/containerType.model';
import {Container} from '../../../models/container.model';
import {Event} from '@angular/router';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  containers: Container[] = [];
  containerFormGroup: FormGroup;
  bookingDetails: Booking;
  containerType: ContainerType;
  filteredContainerTypes: any[];
  allContainerTypes: any[];
  containerTypeMap: Map<string, number> = new Map();

  numberOfContainers = 1;

  /*equipment: SelectItem;
  equipments: SelectItem[];*/
  constructor() { }

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

    this.allContainerTypes = [{id: 1, name: 'container1'}, {id: 2, name: 'container2'}, {id: 3, name: 'container3'},
      {id: 4, name: 'container4'}, {id: 5, name: 'container5'}, {id: 6, name: 'container6'}];
    this.bookingDetails = new Booking();
    /*this.equipment = {label: 'Carrier Provided', value: {id: 1, name: 'Carrier Provided'}};
    this.equipments = [{label: 'Carrier Provided', value: {id: 1, name: 'Carrier Provided'}},
      {label: 'Shipper Owned', value: {id: 2, name: 'Shipper Owned'}}];*/
    this.containerType = {id: 0, cbm: 100, teu: 75, containerType: '20X20', descirption: '20X20',
      isoCode: 'iso code', size: '20-20', type: '20X20'};
    this.containers = [{id: null, containerNo: '0001',
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
  }

  onContainerTypeSelection(event: ContainerType) {
    // this.bookingDetails.containerDetails = event;
    console.log(event);
  }
  search(event, key) {
    const query = event.query;
    if (key === 'containerType') {
      this.filteredContainerTypes = this.filterContainerTypes(query);
    }
  }


  filterContainerTypes(query): any[] {
    // in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered: any[] = [];
    for (let i = 0; i < this.allContainerTypes.length; i++) {
      const containerType = this.allContainerTypes[i];
      if ( containerType.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(containerType);
      }
    }
    return filtered;
  }
  saveAndNext() {}

  onSelectedItem(event) {
    console.log(event);
  }
  addContainers(event: Event) {
    console.log('Add event: ' + this.numberOfContainers);
    for (let i = 0; i < this.numberOfContainers; i++) {
      const container = new Container();
      container.containerType = this.containerType;
      container.containerNo = 'number:' + i;
      this.containers.push(container);
      console.log('Container added.. size = ' + this.containers.length);

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

    displayContainerType(event: Event) {}
  displayCommodityType(event: Event) {

  }
}
