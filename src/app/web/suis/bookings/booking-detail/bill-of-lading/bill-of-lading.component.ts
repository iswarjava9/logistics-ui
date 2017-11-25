import { BillOfLadingService } from './service/bill-of-lading.service';
import { format } from 'date-fns';
import { SelectItem } from 'primeng/primeng';
import { ForeignAgent } from './../../../models/foreignAgent.model';
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
      // this.billOfLading = new BillOfLading();
      this.billOfLading = this.billOfLadingSvc.copyBookingToHBL(this.bookingSvc.getBookingDetails(), new BillOfLading());
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
      'precarriageBy': new FormControl(this.preCarrieageList[0].value) // Truck/Rail/Burge
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
          this.populateFormGroup(this.blDetailsFormGroup, this.billOfLading);
        }
      );
    }
    
  }
  
  printBL(billOfLading: string){
    if(isNullOrUndefined(this.billOfLading.id)){
      return
    }
    this.disableScreen = true;
    this.billOfLadingSvc.getBillOfLadingPdf(this.billOfLading.id).subscribe(
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
    
}
