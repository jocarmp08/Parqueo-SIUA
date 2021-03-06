import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {SharedService} from './shared.service';
import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatInputModule,
  MatNativeDateModule,
  MatSnackBarModule
} from '@angular/material';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModifyCounterDialogComponent} from './modify-counter-dialog/modify-counter-dialog.component';
import {DlDateTimePickerDateModule} from 'angular-bootstrap-datetimepicker';
import {NewPasswordDialogComponent} from './new-password-dialog/new-password-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DlDateTimePickerDateModule
  ],
  declarations: [
    ConfirmationDialogComponent,
    DatePickerDialogComponent,
    ModifyCounterDialogComponent,
    NewPasswordDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent,
    DatePickerDialogComponent,
    ModifyCounterDialogComponent,
    NewPasswordDialogComponent
  ],
  entryComponents: [ConfirmationDialogComponent, DatePickerDialogComponent, ModifyCounterDialogComponent, NewPasswordDialogComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [SharedService]
    };
  }
}
