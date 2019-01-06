import {Component, OnInit} from '@angular/core';
import {News} from '../news/rest/news.model';
import {FormBuilder, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {SharedService} from '../shared/shared.service';
import {Observable} from 'rxjs';
import {ReportService} from './rest/report.service';
import {Report} from "./rest/report.model";


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  // Report Array
  public reportArray: Array<Report> = [];
  public errorsArray: Array<Report> = [];
  public commentsArray: Array<Report> = [];

  public currentEmail: string = "Ningún reporte seleccionado";
  public currentDescription : string = "Ningún reporte seleccionado";
  public maxDescriptionLength = 280;


  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private reportService: ReportService,
              private sharedService: SharedService) {
  }

  ngOnInit() {

    this.reportService.getReports().subscribe((data:Array<Report>) => {

      this.reportArray = data;
      for (let report of this.reportArray){
        if (report.type===1) {
          console.log("comment: " + report.email);
          this.commentsArray.push(report);
        }
        else{
        console.log("error: " + report.email);
          this.errorsArray.push(report);
        }

      }
    });

  }




deleteReport(reportToDelete: Report) {
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
        if (reportToDelete.type===1){
          this.commentsArray.splice(this.commentsArray.indexOf(reportToDelete), 1);        }
        else{
          this.errorsArray.splice(this.errorsArray.indexOf(reportToDelete), 1);
        }
      }, (error) => {
        console.log(error);
      });
    }
  });
}

setReportViewModeOn(eventToView: Report) {
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

}
