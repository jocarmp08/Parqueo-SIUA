import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {SharedService} from './shared.service';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ConfirmationDialogComponent,
    DatePickerDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent,
    DatePickerDialogComponent
  ],
  entryComponents: [ConfirmationDialogComponent, DatePickerDialogComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [SharedService]
    };
  }
}
