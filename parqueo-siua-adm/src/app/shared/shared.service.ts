import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Observable} from 'rxjs';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {ModifyCounterDialogComponent} from './modify-counter-dialog/modify-counter-dialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private dialog: MatDialog, private httpClient: HttpClient) {
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

  showModifyNowCounterDialog(counter: number, maxCounter: number): Observable<number> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      counter: counter,
      maxCounter: maxCounter
    };
    return this.dialog.open(ModifyCounterDialogComponent, dialogConfig).afterClosed();
  }

  showModifyMaxCounterDialog(maxCounter: number): Observable<number> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      counter: maxCounter,
      maxCounter: 1000
    };
    return this.dialog.open(ModifyCounterDialogComponent, dialogConfig).afterClosed();
  }

  publishNotification(type: string, title: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Authorization', 'key=AAAAYAAMItE:APA91bFOGZS632oURzJ8ibbuSx-kSAGSb9ZXTIFR3D8V9fGdvnXoIBSdx5qB2Z91_-1Hy49TJCMWKPmPvgTlfQbm_1vk1wLnCqN98dy78HPtatW1R8f8QP2nmpgeCxhMCBofZGGrAq5L');

    let notificationTitle: string;
    let notficationTo: string;
    if (type === 'event') {
      notificationTitle = 'Nuevo evento';
      notficationTo = '/topics/events';
    }

    let body = {
      'notification':
        {
          'title': notificationTitle,
          'text': 'SIUA publicó: ' + title,
          'sound': 'default',
          'badge': '1',
          'color': '#bc093b'
        },
      'priority': 'normal',
      'to': notficationTo
    };

    return this.httpClient.post('https://fcm.googleapis.com/fcm/send', body, {headers: headers}).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }

}
