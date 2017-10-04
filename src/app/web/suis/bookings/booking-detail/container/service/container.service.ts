import { ConfigService } from './../../../../services/config.service';
import { Container } from './../../../../models/container.model';
import { Commodity } from './../../../../models/commodity.model';
import { ContainerType } from './../../../../models/containerType.model';
import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, ResponseContentType} from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class ContainerService {
  headers: Headers = new Headers();
  private options: RequestOptions ;
  
  hosturl = '';

  constructor(private http: Http, private configSvc: ConfigService) {
    this.headers.append('Accept', 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.hosturl = configSvc.getConfiguration().baseUrl;
  }


  getContainerTypeByName(type: string): any {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.get( this.hosturl + '/logistics/containertype/bytype/' + type, this.options);
  }
  getCommoditiesByName(query: string): any {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.get( this.hosturl + '/logistics/commodity/byname/' + query, this.options);
  }
  addContainerType(containerType: ContainerType): any {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.post( this.hosturl + '/logistics/containertype/', containerType, this.options);
  }
  addCommodity(commodity: Commodity): any {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.post( this.hosturl + '/logistics/commodity/', commodity, this.options);
  }

  addContainer(container: Container): any {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.post( this.hosturl + '/logistics/container/', container, this.options);
  }

  removeContainer(id: number) {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.delete( this.hosturl + '/logistics/container/' + id, this.options);
  }

  updateContainers(containers: Container[]) {
    this.options = new RequestOptions({headers: this.headers});
    return this.http.put( this.hosturl + '/logistics/container/', containers, this.options);
  }
}
