import {ReportService} from '../../services/report.service';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/table';

export class ErrorsDataSource extends DataSource<any> {
  constructor(private reportsService: ReportService) {
    super();
  }

  connect(): Observable<any> {
    return this.reportsService.getErrors();
  }

  disconnect() {
  }
}
