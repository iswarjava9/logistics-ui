import { OceanImportListComponent } from './web/suis/bookings/booking-list/ocean-import-list/ocean-import-list.component';
import { OceanImpComponent } from './web/suis/bookings/booking-detail/booking/ocean-imp/ocean-imp.component';
import { LoginComponent } from './web/suis/shared/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteListComponent } from './web/suis/quotes/quote-list/quote-list.component';
import {BookingListComponent} from './web/suis/bookings/booking-list/booking-list.component';
import {QuoteDetailComponent} from './web/suis/quotes/quote-detail/quote-detail.component';
import {BookingDetailComponent} from './web/suis/bookings/booking-detail/booking-detail.component';

import {HomeComponent} from './web/suis/shared/home/home.component';
import {AuthgaurdService} from './web/suis/shared/auth/authgaurd.service';

const logisoftAppRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent , canActivate: [AuthgaurdService]},
  { path: 'quote-list', component: QuoteListComponent, pathMatch: 'full', canActivate: [AuthgaurdService] },
  { path: 'booking-list', component: BookingListComponent, pathMatch: 'full', canActivate: [AuthgaurdService]},
  { path: 'quote-detail', component: QuoteDetailComponent, pathMatch: 'full', canActivate: [AuthgaurdService] },
  { path: 'booking-detail', component: BookingDetailComponent, pathMatch: 'full',  canActivate: [AuthgaurdService] },
  { path: 'booking-detail/:id', component: BookingDetailComponent,  canActivate: [AuthgaurdService] },
  { path: 'booking-oceanImp', component: OceanImpComponent, pathMatch: 'full',  canActivate: [AuthgaurdService] },
  { path: 'booking-oceanImpList', component: OceanImportListComponent, pathMatch: 'full',  canActivate: [AuthgaurdService] }

];

@NgModule({
  imports: [RouterModule.forRoot(logisoftAppRoutes)],
  exports: [RouterModule]
})
export class LogisoftRoutingModule {
}
