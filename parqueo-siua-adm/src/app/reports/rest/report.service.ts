import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  // endpoint = 'http://167.99.240.71:3000/api/';
  endpoint = 'http://localhost:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getReports(): Observable<any> {
    const url = this.endpoint + 'reports/';
    return this.httpClient.get(url).pipe(map(this.extractData));
  }


  deleteReports(id): Observable<any> {
    const url = this.endpoint + 'reports/' + id;
    return this.httpClient.delete(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
