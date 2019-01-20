import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {SharedService} from '../../shared/shared.service';
import {Observable} from 'rxjs';
import {ReportModel} from '../../models/report.model';
import {ReportService} from '../../services/report.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // Username
  private username: string;
  // Report Array
  public reportArray: Array<ReportModel> = [];
  public errorsArray: Array<ReportModel> = [];
  public commentsArray: Array<ReportModel> = [];

  public currentEmail: string = 'Ningún reporte seleccionado';
  public currentDescription: string = 'Ningún reporte seleccionado';
  public maxDescriptionLength = 280;


  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private reportService: ReportService,
              private sharedService: SharedService) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {

    this.reportService.getReports().subscribe((data: Array<ReportModel>) => {

      this.reportArray = data;
      for (let report of this.reportArray) {
        if (report.type === 0) {
          console.log('comment: ' + report.email);
          this.commentsArray.push(report);
        }
        else {
          console.log('error: ' + report.email);
          this.errorsArray.push(report);
        }

      }
    });

  }


  deleteReport(reportToDelete: ReportModel) {
    // Ask for confirmation
    this.showDialogConfirmation('delete').subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID
        const id = reportToDelete.id;
        // Call REST API
        this.reportService.deleteReports(id).subscribe((data) => {
          // Show output message
          this.showOutputMessage(reportToDelete.id + ' se ha eliminado correctamente', 'Aceptar');
          // Update news array
          this.reportArray.splice(this.reportArray.indexOf(reportToDelete), 1);
          if (reportToDelete.type === 1) {
            this.commentsArray.splice(this.commentsArray.indexOf(reportToDelete), 1);
          }
          else {
            this.errorsArray.splice(this.errorsArray.indexOf(reportToDelete), 1);
          }
        }, (error) => {
          console.log(error);
        });
      }
    });
  }

  setReportViewModeOn(eventToView: ReportModel) {
    this.currentEmail = eventToView.email;
    this.currentDescription = eventToView.description;
  }


  private showDialogConfirmation(report: string): Observable<boolean> {
    // Prepare messages
    let title: string;
    let message: string;
    if (report === 'update') {
      title = 'Confirmar modificación';
      message = '¿Modificar este evento?';
    } else if (report === 'delete') {
      title = 'Confirmar eliminación';
      message = '¿Eliminar este evento?';
    }

    return this.sharedService.showConfirmationDialog(title, message);
  }


  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  private logout() {
    this.sharedService.logout();
  }

  private changePassword() {
    this.sharedService.changePassword();
  }
}
