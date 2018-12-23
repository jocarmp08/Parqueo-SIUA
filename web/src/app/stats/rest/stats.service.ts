import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  endpoint = 'http://167.99.240.71:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getEntriesFromDate(date: Date): Observable<any> {
    const url = this.endpoint + 'entrances?filter[order]=date&filter[where][date][gte]=' + date.toISOString();
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  getEntriesTimeFrame(from: Date, to: Date): Observable<any> {
    const url = this.endpoint + 'entrances?filter[order]=date&filter[where][and][0][date][gte]=' + from.toISOString() +
      '&filter[where][and][1][date][lte]=' + to.toISOString();
    console.log(url);
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
