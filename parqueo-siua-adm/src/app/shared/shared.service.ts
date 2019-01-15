import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Observable} from 'rxjs';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {ModifyCounterDialogComponent} from './modify-counter-dialog/modify-counter-dialog.component'

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private dialog: MatDialog) {
  }

  showConfirmationDialog(title: string, message: string): Observable<boolean> {
    // Prepare dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message
    };

    // Show and wait
    return this.dialog.open(ConfirmationDialogComponent, dialogConfig).afterClosed();
  }

  showDatePickerDialog(): Observable<Date> {
    // Prepare dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Show and wait
    return this.dialog.open(DatePickerDialogComponent, dialogConfig).afterClosed();
  }

  showCounterDialog(counter: number , maxCounter:number): Observable<number> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data={
      counter: counter,
      maxCounter: maxCounter
    };
    return this.dialog.open(ModifyCounterDialogComponent, dialogConfig).afterClosed();
  }

  changeMax(maxCounter:number): Observable<number> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data={
      counter: maxCounter,
      maxCounter: 1000
    };
    return this.dialog.open(ModifyCounterDialogComponent, dialogConfig).afterClosed();
  }

}
