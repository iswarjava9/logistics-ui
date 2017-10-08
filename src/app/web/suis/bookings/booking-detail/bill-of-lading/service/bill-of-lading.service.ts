import { BillOfLading } from './../../../../models/billOfLading.model';
import { ConfigService } from './../../../../services/config.service';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BillOfLadingService {
  private headers: Headers = new Headers();
  private options: RequestOptions;
  HOST = '';
  constructor(private http: Http, private configSvc: ConfigService) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    this.HOST = configSvc.getConfiguration().baseUrl;
  }
  getBillOfLading(bookingId: number): any {
    return this.http.get( this.HOST + '/logistics/billoflading/' + bookingId,this.options);
  }

  saveBillOfLading(billoflading): any {
    return this.http.post(this.HOST + '/logistics/billoflading', billoflading, this.options);
  }

  updateBillOfLading(billoflading): any {
    return this.http.put(this.HOST + '/logistics/billoflading', billoflading, this.options);
  }

  getBillOfLadingPdf(billOfLading) {
    const headersLocal = new Headers({
      'Content-Type': 'application/pdf',
      'Accept': 'application/pdf'});
 
    return this.http.post(this.HOST + '/logistics/billoflading/download/', billOfLading, new RequestOptions({headers: headersLocal}));
    }
}
