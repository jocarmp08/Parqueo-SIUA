import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountersService {

  private endpoint: string = 'http://167.99.240.71:4097/';

  constructor(private httpClient: HttpClient) {
  }

  getData(): Observable<any> {
    const url = this.endpoint + 'api';
    return this.httpClient.get(url).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  getEventTarget(): EventTarget {
    const url = this.endpoint + 'stream';
    return new EventSource(url);
  }

  putNowCounters(nowCommon: number, nowHandicapped: number) {
    const data = {
      'nowCommon': nowCommon,
      'nowHandicapped': nowHandicapped
    };
    const url = this.endpoint + 'now';
    return this.httpClient.put(url, data).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  putMaxCounters(maxCommon: number, maxHandicapped: number, nowCommon: number, nowHandicapped: number) {
    const data = {
      'maxCommon': maxCommon,
      'maxHandicapped': maxHandicapped,
      'nowCommon': nowCommon,
      'nowHandicapped': nowHandicapped
    };
    const url = this.endpoint + 'max';
    return this.httpClient.put(url, data).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  putNowCommonCounterByOne(event: string) {
    const data = {
      'event': event,
    };
    const url = this.endpoint + 'common';
    return this.httpClient.put(url, data).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  putNowHandicappedCounterByOne(event: string) {
    const data = {
      'event': event,
    };
    const url = this.endpoint + 'handicapped';
    return this.httpClient.put(url, data).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  private extractData(res: Response) {
    return res || {};
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
