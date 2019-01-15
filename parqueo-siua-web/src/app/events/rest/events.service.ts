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

  getTodayEvents(today: Date, tomorrow: Date): Observable<any> {
    const url = this.endpoint + 'events?filter[order]=date&filter[where][and][0][startDate][gte]=' + today.toISOString() +
      '&filter[where][and][1][endDate][lt]=' + tomorrow.toISOString();
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
