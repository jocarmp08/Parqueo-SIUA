import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  endpoint = 'http://167.99.240.71:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getEventNotEnded(date: Date): Observable<any> {
    const url = this.endpoint + 'events?filter[order]=startDate&filter[where][endDate][gt]=' + date.toISOString();
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  postEvent(event): Observable<any> {
    const url = this.endpoint + 'events';
    return this.httpClient.post(url, event).pipe(map(this.extractData));
  }

  putEventWithId(id, event): Observable<any> {
    const url = this.endpoint + 'events/' + id;
    return this.httpClient.put(url, event).pipe(map(this.extractData));
  }

  deleteEvent(id): Observable<any> {
    const url = this.endpoint + 'events/' + id;
    return this.httpClient.delete(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
