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

  private extractData(res: Response) {
    return res || {};
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
