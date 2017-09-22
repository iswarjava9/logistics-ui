import { AuthService } from './web/suis/shared/auth/auth.service';
import { RootService } from './root.service';
import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/components/common/messageservice';
import {Message} from 'primeng/components/common/Message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]

})
export class AppComponent implements OnInit{
  title = 'app';

  loadedFeature = 'quote-list';
  msgs: Message[] = [];

  constructor(private rootSvc: RootService, private auth: AuthService){}

  ngOnInit(){
    this.rootSvc.getTimeZones();
  }
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
