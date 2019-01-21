import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReportModel} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  endpoint = 'http://167.99.240.71:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  postReport(report): Observable<any> {
    const url = this.endpoint + 'reports';
    return this.httpClient.post(url, report).pipe(map(this.extractData));
  }


  private extractData(res: Response) {
    return res || {};
  }
}
