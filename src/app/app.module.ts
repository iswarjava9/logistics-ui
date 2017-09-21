import { ContainerService } from './web/suis/bookings/booking-detail/container/service/container.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { APP_INITIALIZER } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


import {DropdownModule} from 'primeng/components/dropdown/dropdown';
import {DataTableModule} from 'primeng/components/DataTable/DataTable';
import {MultiSelectModule} from 'primeng/components/MultiSelect/MultiSelect';
import {SliderModule} from 'primeng/components/Slider/Slider';
import {AutoCompleteModule} from 'primeng/components/AutoComplete/AutoComplete';
import {CalendarModule} from 'primeng/components/calendar/calendar';
import {StepsModule} from 'primeng/components/steps/steps';
import {MenuItem} from 'primeng/components/common/menuitem';
import {AccordionModule} from 'primeng/components/accordion/accordion';
import {OverlayPanelModule} from 'primeng/components/overlaypanel/overlaypanel';
import {GrowlModule} from 'primeng/components/growl/growl';
import {DialogModule} from 'primeng/components/dialog/dialog';
import {InputTextareaModule} from 'primeng/components/inputtextarea/inputtextarea';
import {BlockUIModule} from 'primeng/components/blockui/blockui';
import {InputMaskModule} from 'primeng/components/inputMask/inputMask';

import {AuthService} from './web/suis/shared/auth/auth.service';
import {AuthgaurdService} from './web/suis/shared/auth/authgaurd.service';
import {ConfigLoader} from './ConfigLoader';


/*import {SharedModule} from 'primeng/Shared';*/

import { AppComponent } from './app.component';
import { HeaderComponent } from './web/suis/header/header.component';
import { QuoteListComponent } from './web/suis/quotes/quote-list/quote-list.component';
import { QuoteDetailComponent } from './web/suis/quotes/quote-detail/quote-detail.component';
import { BookingListComponent } from './web/suis/bookings/booking-list/booking-list.component';
import { BookingDetailComponent } from './web/suis/bookings/booking-detail/booking-detail.component';
import {LogisoftRoutingModule} from './app-routing.module';
import {RootService} from './root.service';
import { ConfigService } from './web/suis/services/config.service';
import {BookingListService} from './web/suis/bookings/booking-list/service/booking-list.service';
import {BookingDetailService} from './web/suis/bookings/booking-detail/service/booking-detail.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { BookingComponent } from './web/suis/bookings/booking-detail/booking/booking.component';
import { ContainerComponent } from './web/suis/bookings/booking-detail/container/container.component';
import { ChargesComponent } from './web/suis/bookings/booking-detail/charges/charges.component';
import {BookingService} from './web/suis/bookings/booking-detail/booking/service/booking.service';
import {SpinnerComponent} from './web/suis/shared/spinner/spinner.component';
import {HomeComponent} from './web/suis/shared/home/home.component';
import {CallbackComponent} from './web/suis/shared/callback/callback.component';
// import { LoginComponent } from './web/suis/shared/login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CallbackComponent,
    QuoteListComponent,
    QuoteDetailComponent,
    BookingListComponent,
    BookingDetailComponent,
    BookingComponent,
    ContainerComponent,
    ChargesComponent,
    SpinnerComponent,
    // LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LogisoftRoutingModule,
    DataTableModule,
    CommonModule,
    StepsModule,
    GrowlModule,
    DialogModule,
    InputTextareaModule,
  /*  SharedModule,*/
    DropdownModule,
    SliderModule,
    MultiSelectModule,
    AutoCompleteModule,
    AccordionModule,
    OverlayPanelModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    CalendarModule,
    BlockUIModule,
    InputMaskModule
  ],
  providers: [RootService, ConfigService,{
    provide: APP_INITIALIZER,
    useFactory: ConfigLoader,
    deps: [ConfigService],
    multi:true
},/*  AuthService, AuthgaurdService,  */BookingListService, BookingService, ContainerService, BookingDetailService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
