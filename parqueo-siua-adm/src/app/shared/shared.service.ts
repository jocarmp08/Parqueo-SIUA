import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {ConfirmationDialogComponent} from './confirmation-dialog/confirmation-dialog.component';
import {DatePickerDialogComponent} from './date-picker-dialog/date-picker-dialog.component';
import {ModifyCounterDialogComponent} from './modify-counter-dialog/modify-counter-dialog.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {NewPasswordDialogComponent} from './new-password-dialog/new-password-dialog.component';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private dialog: MatDialog, private httpClient: HttpClient, private authService: AuthService, private snackBar: MatSnackBar) {
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

  changePassword() {
    this.showPasswordDialog().subscribe(data => {
      if (data) {
        this.authService.changePassword(data.old, data.new).subscribe(resp => {
          this.showOutputMessage('La contraseña se ha cambiado con éxito', 'Aceptar');
        }, error => {
          this.showOutputMessage('Ocurrio un error al cambiar la contraseña, intente de nuevo', 'Aceptar');
        });
      }
    });
  }

  private showPasswordDialog(): Observable<any> {
    // Prepare dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Show and wait
    return this.dialog.open(NewPasswordDialogComponent, dialogConfig).afterClosed();
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
    } else if (type === 'news') {
      notificationTitle = 'Nueva noticia';
      notficationTo = '/topics/news';
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

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.logout();
  }

  isSU() {
    return this.authService.isSU();
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}
