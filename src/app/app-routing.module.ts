import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteListComponent } from './web/suis/quotes/quote-list/quote-list.component';
import {BookingListComponent} from './web/suis/bookings/booking-list/booking-list.component';
import {QuoteDetailComponent} from './web/suis/quotes/quote-detail/quote-detail.component';
import {BookingDetailComponent} from './web/suis/bookings/booking-detail/booking-detail.component';

const logisoftAppRoutes: Routes = [
  { path: '', redirectTo: '/quote-list', pathMatch: 'full' },
  { path: 'quote-list', component: QuoteListComponent },
  { path: 'booking-list', component: BookingListComponent },
  { path: 'quote-detail', component: QuoteDetailComponent },
  { path: 'booking-detail', component: BookingDetailComponent },
  { path: 'booking-detail/:id', component: BookingDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(logisoftAppRoutes)],
  exports: [RouterModule]
})
export class LogisoftRoutingModule {
}
