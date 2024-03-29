import {Event,ActivatedRoute, Params, Router} from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { forEach } from '@angular/router/src/utils/collection';
import { DataTable } from 'primeng/components/DataTable/DataTable';
import {DateHelper} from '../../../util/dateHelper';
import { BookingService } from './../booking/service/booking.service';
import { BookingDetailService } from './../service/booking-detail.service';
import { BillOfLadingService } from './../bill-of-lading/service/bill-of-lading.service';
import { Commodity } from './../../../models/commodity.model';
import { isNullOrUndefined } from 'util';
import { ContainerService } from './service/container.service';
import { ContainerType } from './../../../models/containerType.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ShortInfo} from '../../../models/metamodel/shortInfo.model';
import {ContainerTypeShortInfo} from '../../../models/metamodel/containerTypeShortInfo.model';
import {Booking} from '../../../models/booking.model';
import {SelectItem} from 'primeng/components/common/selectitem';
import {Container} from '../../../models/container.model';
import {Dialog} from 'primeng/components/dialog/dialog';
import { Message } from 'primeng/components/common/message';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  @Output() stepIndex: EventEmitter<number> = new EventEmitter<number>();

  containers: Container[] = [];
  containerFormGroup: FormGroup;
  containerTypeFormGroup: FormGroup;
  commodityFormGroup: FormGroup;
  bookingDetails: Booking;
  containerTypeDetail: ContainerType = null ;
  commodity: Commodity = null;
  filteredContainerTypes: any[];
  filteredCommodities: any[];
  allContainerTypes: any[];
  update: boolean;
  
  disableScreen = false;
  
  numberOfContainers = 1;
  displayOnly = false;

  equipment: SelectItem;
  equipments: SelectItem[];
  
  containerTypeList: SelectItem[] = [{label: 'Select', value: 'SELECT'},{label: 'FCL', value: 'FCL'}, {label: 'LCL', value: 'LCL'}];;

  selectedContainer: Container = null;
  displayConatinerDialog = false;
  

  constructor(private containerSvc: ContainerService, private bookingSvc: BookingService, private router: Router, private msgSvc: MessageService, private route: ActivatedRoute,
    private bookingDetailSvc: BookingDetailService, private billOfLadingSvc: BillOfLadingService) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.update = params['editable'];
     }
    );
  //  this.bookingSvc.getMessages().forEach(message => this.msgsGrowl.push(message));
    
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
   
    this.bookingDetails = this.bookingSvc.getBookingDetails();
    if(isNullOrUndefined(this.bookingDetails)){
      this.bookingDetails = new Booking();
      this.bookingDetails.containerDetails = [];
    }else if(isNullOrUndefined(this.bookingDetails.containerDetails)){
      this.bookingDetails.containerDetails = [];
    }

  } 
  search(event, key) {
    const query = event.query;
    if (key === 'containerType') {
      this.filterContainerTypes(query);
    }else if (key === 'commodity') {
      this.filterCommodities(query);
    }
  }


  filterContainerTypes(query) {
    this.containerSvc.getContainerTypeByName(query).
    subscribe(
        (res: any) => {
            this.filteredContainerTypes = res.json();
            console.log(JSON.stringify(res.json()));
        });
  }
  filterCommodities(query) {
    this.containerSvc.getCommoditiesByName(query).
    subscribe(
        (res: any) => {
            this.filteredCommodities = res.json();
          });
   }

   saveAndNext() {}

   addContainers(event: Event, dialog: Dialog) {
    
    dialog.visible = true;
  } 

  addContainersToBooking(event: Event, dialog: Dialog){
       
    if(isNullOrUndefined(this.containerTypeDetail)){
      this.msgSvc.add({severity: 'warn', summary: 'Container type is required field', detail: ''});
      return;
    }
    if(isNullOrUndefined(this.commodity)){
      this.msgSvc.add({severity: 'warn', summary: 'Commodity is required field.', detail: ''});
      return;
    }
    
    if(isNullOrUndefined(this.bookingDetails.containerDetails)){
      this.bookingDetails.containerDetails = [];
    }
    let counter = this.numberOfContainers;
    if(this.bookingSvc.getBookingId() != null && counter > 0){
      this.disableScreen = true;
    }else{
      return;
    }
    for (let i = 0; i < this.numberOfContainers; i++) {
        const container = new Container();
        container.bookingId = this.bookingSvc.getBookingId();
        container.containerType = this.containerTypeDetail;
        container.commodity = this.commodity;
        this.containerSvc.addContainer(container).subscribe(
              (response) => {
                const containerid = Number(response.headers.get('containerid'));
                container.id = containerid;
                this.bookingDetails.containerDetails.push(container);
                this.msgSvc.add({severity: 'success', summary: 'Add', detail: 'Container is added.'});
                if(--counter == 0) {
                  this.disableScreen = false;
                }
                let containerList = [];
                this.bookingDetails.containerDetails.forEach(item => containerList.push(item));
                this.bookingDetails.containerDetails = containerList;
              },
              (error) => {
                if(--counter == 0) {
                  this.disableScreen = false;
                }
                this.msgSvc.add({severity: 'error', summary: 'Add', detail: 'Container is not added.'});
              }
        );
      }

      // reset 
      this.containerTypeDetail = new ContainerType();
      this.commodity = new Commodity();
      this.numberOfContainers = 1;
      dialog.visible = false;
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
  this.containerTypeDetail = new ContainerType();
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('cbm'))){
    this.containerTypeDetail.cbm = this.containerTypeFormGroup.get('cbm').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('size'))){
    this.containerTypeDetail.size = this.containerTypeFormGroup.get('size').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('teu'))){
    this.containerTypeDetail.teu = this.containerTypeFormGroup.get('teu').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('type'))){
    this.containerTypeDetail.type = this.containerTypeFormGroup.get('type').value;
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('containerType'))){
    this.containerTypeDetail.containerType = this.containerTypeFormGroup.get('containerType').value;
    console.log('Added container type with container type '+ this.containerTypeFormGroup.get('containerType').value);
  }
  if(!isNullOrUndefined(this.containerTypeFormGroup.get('description'))){
    this.containerTypeDetail.descirption = this.containerTypeFormGroup.get('description').value;
  }
  this.disableScreen = true;
   this.containerSvc.addContainerType(this.containerTypeDetail).subscribe(
      (response) => {
        this.containerTypeDetail.id = Number(response.headers.get('containertypeid'));
        console.log('FCL/LCL: ' + this.containerTypeDetail.containerType);
        this.disableScreen = false;
        dialog.visible = false;
        this.msgSvc.add({severity: 'success', summary: 'Add Container Type', detail: 'Container Type is added.'});
      },
      (error) => {
        this.msgSvc.add({severity: 'error', summary: 'Add Container Type ', detail: 'Container Type is not added.'});
        this.disableScreen = false;
      }
  
); 
}
createCommodity(dialog: Dialog){
  this.disableScreen = true;
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
          dialog.visible = false;
          this.disableScreen = false;
          this.msgSvc.add({severity: 'success', summary: 'Add Commodity', detail: 'Commodity is added.'});
        },
        (error) => {
          this.disableScreen = false;
          this.msgSvc.add({severity: 'error', summary: 'Add Commodity', detail: 'Commodity is not added.'});
        }
    ); 
  }

  print(bookingId: number) {
    // this.msgsGrowl = [];
    this.disableScreen = true;
    this.bookingSvc.getPDF(bookingId).subscribe(
        (response: any) => {
            this.bookingSvc.printBookingConfirmation(response, bookingId);
            this.msgSvc.add({severity: 'success', summary: 'PDF Generation ', detail: 'Booking Confirmation PDF is generated.'});
            this.disableScreen = false;
          },
        error => {console.log(error);
            this.disableScreen = false;
            this.msgSvc.add({severity: 'error', summary: 'PDF Generation ', detail: 'PDF generation failed.'});
          },
        success => {
            console.log(success);
            this.disableScreen = false;
        }
    );
}

cancelBooking(){
 // this.msgsGrowl = [];
  this.disableScreen = true;
  this.bookingDetails.bookingStatus = 'CANCELLED';
  this.msgSvc.add({severity: 'info', summary: 'Cancel Booking', detail: 'Cancelling Booking...'});
  // this.msgsGrowl.push({severity: 'info', summary: 'Cancel Booking', detail: 'Cancelling Booking...'});
  
    this.bookingSvc.modifyBooking(this.bookingSvc.removeTimeZoneFromBooking(this.bookingDetails)).subscribe(
    (response: any) => {
      const body = response.json();
      DateHelper.convertDateStringsToDates(body);
       this.bookingDetails = body;
       this.bookingSvc.updateBooking(this.bookingDetails);   
       this.disableScreen = false;
       this.msgSvc.add({severity: 'info', summary: 'Cancel Booking', detail: 'Booking is cancelled'});
       this.bookingDetailSvc.removeLastStepItem();
    },
    error => {console.log(error);
      this.disableScreen = false;
      this.msgSvc.add({severity: 'error', summary: 'Cancellation failed', detail: 'Booking cancellation is failed'});
      // this.msgsGrowl.push({severity: 'error', summary: 'Cancellation failed', detail: 'Booking cancellation is failed'});
      }
  );
}

confirmBooking(){
  this.disableScreen = true;
  this.bookingDetails.bookingStatus = 'CONFIRMED';
  this.msgSvc.add({severity: 'info', summary: 'Confirm Booking', detail: 'Confirming Booking...'});
  let jsonString = JSON.stringify(this.bookingDetails);
  jsonString = JSON.parse(jsonString);

   DateHelper.removeTimeAndTimeZone(jsonString);
    this.bookingSvc.modifyBooking(this.bookingSvc.removeTimeZoneFromBooking(this.bookingDetails)).subscribe(
    (response: any) => {
      const body = response.json();
      DateHelper.convertDateStringsToDates(body);
       this.bookingDetails = body;
      this.bookingSvc.updateBooking(this.bookingDetails);   
      this.msgSvc.add({severity: 'info', summary: 'Modify Booking', detail: 'Booking is Confirmed'});
      this.disableScreen = false;
      this.bookingDetailSvc.addStepItem({label: 'B/L'});
    },
    error => {console.log(error);
      this.disableScreen = false;
      this.msgSvc.add({severity: 'error', summary: 'Confirmation failed', detail: 'Booking confirmation is failed'});
      }
  );
}

exit() {
  this.msgSvc.clear();
  this.router.navigate(['/booking-list']);
}

calculateGroupSize(type: string) {
    let total = 0;
    if(this.bookingDetails.containerDetails) {
      for(let container of this.bookingDetails.containerDetails) {
          if(container.containerType.type === type) {
              total += 1;
          }
      }
  }
  return total;
}
onRowSelect(event: Event) {
  this.selectedContainer = event['data'];
  this.displayConatinerDialog = true;
}

deleteContainer(id: number, event: Event){
  console.log('Deleting container with id: ' + id + ' and event ' + event);
  this.disableScreen = true;
  this.containerSvc.removeContainer(id).subscribe(
    (response) => {
      let containerList = [];
      this.bookingDetails.containerDetails.forEach(
        container => {if(container.id != id){
          containerList.push(container);
        }
      });
      this.bookingDetails.containerDetails = containerList;
      this.disableScreen = false;
      this.displayConatinerDialog = false;
      this.msgSvc.add({severity: 'success', summary: 'Container removed', detail: 'Container is removed.'});
    },
    (error) => {
      this.disableScreen = false;
      this.msgSvc.add({severity: 'error', summary: 'Container removal failed', detail: 'Container removal failed .'});
    }
  );
}
  updateContainer(event: Event){
    console.log(event);
  }
  
  next() {
    this.stepIndex.emit(2);
  }

  back() {
    this.stepIndex.emit(0);
  }

  generateInvoice(){
    this.disableScreen = true;
    this.msgSvc.add({severity: 'info', summary: 'Invoice', detail: 'Draft Invoice generation in progress.'});
    this.bookingDetailSvc.generateInvoice(this.bookingSvc.removeTimeZoneFromBooking(this.bookingDetails)).subscribe(
      (response) => {
        this.disableScreen = false;
        this.msgSvc.add({severity: 'success', summary: 'Invoice', detail: 'Draft Invoice generated.'});
      },
      (error) => {
        this.disableScreen = false;
        this.msgSvc.add({severity: 'error', summary: 'Invoice', detail: 'Draft Invoice is not generated.'});
      }
    );
  }

  updateContainers() {
    let counter = this.bookingDetails.containerDetails.length;
    if(counter > 0 ) {
      this.disableScreen = true;
    }
    this.bookingDetails.containerDetails.forEach(container => {
      console.log('Container id: ' +container.id + '   , with booking id: ' + container.bookingId);
      this.containerSvc.updateContainers(container).subscribe(
        (response) => {
          
          if(--counter == 0 ) {
            this.msgSvc.add({severity: 'success', summary: 'Update Container', detail: 'Container is updated'});
            this.disableScreen = false;
          }
        },
        (error) => {
          this.msgSvc.add({severity: 'error', summary: 'Update Container', detail: 'Container is not updated updated.'});
          if(--counter == 0 ) {
            this.disableScreen = false;
          }
        }
      );
    });
    this.billOfLadingSvc.getBillOfLading(this.bookingDetails.billOfLadingId).subscribe(
      (response) => {
        const billOfLading = response.json();
        this.billOfLadingSvc.addOrUpdateBL(this.billOfLadingSvc.copyBookingToHBL(this.bookingDetails, billOfLading));
      }
    );
    
  }
}
