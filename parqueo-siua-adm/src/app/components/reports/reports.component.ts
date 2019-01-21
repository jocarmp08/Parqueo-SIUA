import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar, MatSort} from '@angular/material';
import {SharedService} from '../../shared/shared.service';
import {ReportModel} from '../../models/report.model';
import {ReportService} from '../../services/report.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {CommentsDataSource} from './comments.data.source';
import {ErrorsDataSource} from './errors.data.source';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ],
})
export class ReportsComponent implements OnInit {
  // Username
  private username: string;
  // Reports
  private commentsDataSource;
  private errorsDataSource;
  displayedColumns = ['email', 'subject', 'creationDate', 'read'];
  expandedReport: ReportModel | null;

  constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, private reportService: ReportService,
              private sharedService: SharedService) {
    this.username = localStorage.getItem('username');
    this.commentsDataSource = new CommentsDataSource(this.reportService);
    this.errorsDataSource = new ErrorsDataSource(this.reportService);
  }

  ngOnInit() {
  }

  private setAsRead(report: ReportModel) {
    report.isRead = true;
    this.reportService.putReport(report).subscribe(data => {
      this.showOutputMessage('El reporte se ha actualizado con éxito', 'Aceptar');
    }, error => {
      this.showOutputMessage('Ocurrió un error al actualizar el reporte, intente de nuevo', 'Aceptar');
    });
  }

  private setAsNotRead(report: ReportModel) {
    report.isRead = false;
    this.reportService.putReport(report).subscribe(data => {
      this.showOutputMessage('El reporte se ha actualizado con éxito', 'Aceptar');
    }, error => {
      this.showOutputMessage('Ocurrió un error al actualizar el reporte, intente de nuevo', 'Aceptar');
    });
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
