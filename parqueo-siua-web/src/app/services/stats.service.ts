import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) {
  }

  getForecast(date: Date): Observable<any> {
    const url = 'http://167.99.240.71:4097/forecast';
    const params = new HttpParams().set('date', date.toISOString());
    return this.httpClient.get(url, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  getEntriesFromDate(date: Date): Observable<any> {
    const endpoint = 'http://167.99.240.71:3000/api/entrances';
    const params = new HttpParams().set('filter[where][date][gte]', date.toISOString());
    return this.httpClient.get(endpoint, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  getEntriesFromTo(from: Date, to: Date): Observable<any> {
    let params = new HttpParams();
    params = params.set('filter[where][date][between][0]', from.toISOString());
    params = params.set('filter[where][date][between][1]', to.toISOString());
    const endpoint = 'http://167.99.240.71:3000/api/entrances';
    return this.httpClient.get(endpoint, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  private extractData(res: Response) {
    return res || {};
  }
}
