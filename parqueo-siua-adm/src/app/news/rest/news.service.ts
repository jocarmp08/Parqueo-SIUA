import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // endpoint = 'http://167.99.240.71:3000/api/';
  endpoint = 'http://localhost:3000/api/';

  constructor(private httpClient: HttpClient) {
  }

  getNewsPublishedAfter(date: Date): Observable<any> {
    const url = this.endpoint + 'news?filter[where][creationDate][gte]=' + date.toISOString();
    return this.httpClient.get(url).pipe(map(this.extractData));
  }

  postNews(news): Observable<any> {
    const url = this.endpoint + 'news';
    return this.httpClient.post(url, news).pipe(map(this.extractData));
  }

  putNewsWithId(id, news): Observable<any> {
    const url = this.endpoint + 'news/' + id;
    return this.httpClient.put(url, news).pipe(map(this.extractData));
  }

  deleteNews(id): Observable<any> {
    const url = this.endpoint + 'news/' + id;
    return this.httpClient.delete(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}
