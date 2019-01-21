import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ReportModel} from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  endpoint = 'http://167.99.240.71:3000/api/';

  // endpoint = 'http://localhost:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getComments(): Observable<any> {
    let params = new HttpParams();
    params = params.set('filter[where][type]', '0');
    const url = this.endpoint + 'reports/';
    return this.httpClient.get(url, {params: params}).pipe(map(this.extractData));
  }

  getErrors(): Observable<any> {
    let params = new HttpParams();
    params = params.set('filter[where][type]', '1');
    const url = this.endpoint + 'reports/';
    return this.httpClient.get(url, {params: params}).pipe(map(this.extractData));
  }

  putReport(report: ReportModel): Observable<any> {
    const url = this.endpoint + 'reports/';
    return this.httpClient.put(url, report).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
