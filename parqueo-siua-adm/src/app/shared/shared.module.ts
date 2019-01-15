import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {SharedService} from './shared.service';
import {MatButtonModule, MatDatepickerModule, MatDialogModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ModifyCounterDialogComponent} from './modify-counter-dialog/modify-counter-dialog.component'

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
    DatePickerDialogComponent,
    ModifyCounterDialogComponent
  ],
  exports: [
    ConfirmationDialogComponent,
    DatePickerDialogComponent,
    ModifyCounterDialogComponent
  ],
  entryComponents: [ConfirmationDialogComponent, DatePickerDialogComponent,ModifyCounterDialogComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [SharedService]
    };
  }
}
