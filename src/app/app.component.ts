import { RootService } from './root.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  loadedFeature = 'quote-list';

  constructor(private rootSvc: RootService){}

  ngOnInit(){
    this.rootSvc.getTimeZones();
  }
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
