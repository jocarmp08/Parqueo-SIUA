import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Observable} from 'rxjs';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';

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
}
