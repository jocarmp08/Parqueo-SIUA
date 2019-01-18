import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MainComponent} from './components/main/main.component';
import {NewsComponent} from './components/news/news.component';
import {EventsComponent} from './components/events/events.component';
import {ReportsComponent} from './components/reports/reports.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import {LoginComponent} from './components/login/login.component';
import {UsersComponent} from './components/users/users.component';
import {EditorModule} from '@tinymce/tinymce-angular';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    NewsComponent,
    EventsComponent,
    ReportsComponent,
    LoginComponent,
    UsersComponent,
  ],
  imports: [
    SharedModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTabsModule,
    EditorModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
