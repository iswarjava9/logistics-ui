import { ConfigService } from './web/suis/services/config.service';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { Injectable } from '@angular/core';
import { TimeZone } from './web/suis/models/timezone.model';

@Injectable()
export class RootService {
  HOST = '';
  headers: Headers = new Headers();
  private options: RequestOptions;
  timezoneIdList = [];
  constructor(private http: Http, private configService: ConfigService) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({headers: this.headers});
    this.HOST = this.configService.getConfiguration().baseUrl;
  }

  initializeTimeZoneIds() {
  
    this.timezoneIdList = [];
    this.fetchTimeZones().subscribe(
      (response) => {
       const timezones: TimeZone[] = response.json();
       timezones.forEach(item => this.timezoneIdList.push({label: item.timeZoneId + ' - ' + item.timeZoneShortName, value: item.timeZoneId}))
      }
    ); 
    
  }
  fetchTimeZones(){
    return this.http.get(this.HOST + '/logistics/region/timezones' , this.options);
  }

  getTimeZones(){
    if(this.timezoneIdList.length < 1){
       this.initializeTimeZoneIds();
    }
    return this.timezoneIdList;
  }
}
