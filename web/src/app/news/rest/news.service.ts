import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  endpoint = 'http://localhost:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getNewsPublishedAfter(date: Date): Observable<any> {
    const url = this.endpoint + 'news?filter[order]=date&filter[where][creationDate][gte]=' + date.toISOString();
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
