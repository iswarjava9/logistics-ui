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
  constructor(private router: Router, private msgSvc: MessageService) { }

  ngOnInit() {
    this.blDetailsFormGroup = new FormGroup({
      'shipper': new FormControl(null),
      'consignee': new FormControl(null),
      'portOfLoading': new FormControl(null),
      'portOfDischarge': new FormControl(null),
      'notify': new FormControl(null),
      'containerDesc': new FormControl(null)
    });
  }
  exit() {
    this.msgSvc.clear();
    this.router.navigate(['/booking-list']);
  }
  back() {
    this.stepIndex.emit(1);
  }

  printBL() {
    
  }
}
