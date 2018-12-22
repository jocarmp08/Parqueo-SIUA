import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainComponent} from './main/main.component';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {NewsComponent} from './news/news.component';
import {EventsComponent} from './events/events.component';
import {StatsComponent} from './stats/stats.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ContactComponent} from './contact/contact.component';
import {HistogramComponent} from './histogram/histogram.component';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {AppRoutingModule} from './app-routing.module';
import {PageComponent} from './page/page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NewsComponent,
    EventsComponent,
    StatsComponent,
    ContactComponent,
    HistogramComponent,
    PageComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatRadioModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ContactComponent, HistogramComponent]
})
export class AppModule {
}
