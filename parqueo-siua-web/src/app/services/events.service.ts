import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private endpoint: string = 'http://167.99.240.71:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getEventsPublishedAndUnfinished(): Observable<any> {
    /*
    This method makes a request, to the database, of the events that have been published to date and have not yet ended
     */
    let params = new HttpParams();
    const now: Date = new Date(new Date().getTime());
    // Published filter
    params.set('filter[where][publicationDate][lte]', now.toISOString());
    // Unfinished filter
    params.set('filter[where][endDate][gt]', now.toISOString());
    const url: string = this.endpoint + 'events?';
    return this.httpClient.get(url, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  getEventsPublishedAndEndingJustToday() {
    const now: Date = new Date(new Date().getTime());
    const tomorrow: Date = this.tomorrowsDate();
    let params = new HttpParams();
    // Published filter
    params = params.set('filter[where][publicationDate][lte]', now.toISOString());
    // Finish today
    params = params.set('filter[where][endDate][between][0]', now.toISOString());
    params = params.set('filter[where][endDate][between][1]', tomorrow.toISOString());
    const url: string = this.endpoint + 'events';
    return this.httpClient.get(url, {params: params}).pipe(
      catchError(this.handleError),
      map(this.extractData)
    );
  }

  private todaysDate(): Date {
    let date: Date = new Date(new Date().getTime());
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    return date;
  }

  private tomorrowsDate(): Date {
    let date: Date = new Date(new Date().getTime());
    date = new Date(date.getTime() + 1000 * 60 * 60 * 24);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    return date;
  }

  private handleError(error: HttpErrorResponse) {
    return Observable.throw(error);
  }

  private extractData(res: Response) {
    return res || {};
  }
}
